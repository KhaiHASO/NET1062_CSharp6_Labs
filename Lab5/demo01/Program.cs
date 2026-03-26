using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.RateLimiting;
using Demo01.RateLimiting.Data;
using Demo01.RateLimiting.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddAuthentication("FakeJwt")
    .AddScheme<AuthenticationSchemeOptions, FakeJwtAuthenticationHandler>("FakeJwt", _ => { });

builder.Services.AddAuthorization();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "text/plain; charset=utf-8";
        await context.HttpContext.Response.WriteAsync(
            "Too many requests. Please try again later.",
            cancellationToken);
    };

    options.AddFixedWindowLimiter("fixed", limiterOptions =>
    {
        limiterOptions.PermitLimit = 5;
        limiterOptions.Window = TimeSpan.FromSeconds(10);
        limiterOptions.QueueLimit = 2;
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
    });

    options.AddSlidingWindowLimiter("SlidingPolicy", limiterOptions =>
    {
        limiterOptions.PermitLimit = 30;
        limiterOptions.Window = TimeSpan.FromSeconds(30);
        limiterOptions.SegmentsPerWindow = 3;
        limiterOptions.QueueLimit = 0;
    });

    options.AddPolicy("anonymous", httpContext =>
    {
        var partitionKey = httpContext.User.Identity?.IsAuthenticated == true
            ? $"anonymous-authenticated:{httpContext.User.Identity?.Name}"
            : $"anonymous:{GetClientIdentifier(httpContext)}";

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey,
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 3,
                Window = TimeSpan.FromSeconds(10),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            });
    });

    options.AddPolicy("authenticated", httpContext =>
    {
        var partitionKey = httpContext.User.Identity?.IsAuthenticated == true
            ? $"authenticated:{httpContext.User.Identity?.Name}"
            : $"authenticated-anonymous:{GetClientIdentifier(httpContext)}";

        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey,
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromSeconds(10),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            });
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();

app.MapGet("/", () => Results.Ok(new
{
    message = "Demo 01 - Rate Limiting voi ASP.NET Core Minimal API",
    swagger = "/swagger"
}));

app.MapGet("/rate-limited", () => "This endpoint is rate-limited!")
    .RequireRateLimiting("fixed")
    .WithName("GetFixedLimitedEndpoint");

app.MapGet("/sliding-endpoint", () => "Sliding Window Rate Limiting!")
    .RequireRateLimiting("SlidingPolicy")
    .WithName("GetSlidingLimitedEndpoint");

app.MapGet("/anonymous", () => "This is for anonymous users!")
    .RequireRateLimiting("anonymous")
    .WithName("GetAnonymousEndpoint");

app.MapGet("/authenticated", (ClaimsPrincipal user) => $"Xin chao {user.Identity?.Name}, day la endpoint danh cho nguoi dung da dang nhap!")
    .RequireAuthorization()
    .RequireRateLimiting("authenticated")
    .WithName("GetAuthenticatedEndpoint");

app.MapGet("/users", async (AppDbContext dbContext) =>
    await dbContext.Users
        .AsNoTracking()
        .OrderBy(user => user.Id)
        .ToListAsync())
    .RequireRateLimiting("fixed")
    .WithName("GetUsers");

app.MapPost("/users", async (CreateUserRequest request, AppDbContext dbContext) =>
{
    var user = new User
    {
        Name = request.Name.Trim()
    };

    dbContext.Users.Add(user);
    await dbContext.SaveChangesAsync();

    return Results.Created($"/users/{user.Id}", user);
})
    .RequireRateLimiting("fixed")
    .WithName("CreateUser");

app.Run();

static string GetClientIdentifier(HttpContext httpContext)
{
    return httpContext.Connection.RemoteIpAddress?.ToString()
        ?? httpContext.Request.Headers.Host.ToString()
        ?? "unknown";
}

public sealed class CreateUserRequest
{
    public string Name { get; set; } = string.Empty;
}

public sealed class FakeJwtAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder)
    : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-Demo-Auth", out var headerValue) ||
            !string.Equals(headerValue.ToString(), "true", StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "demo-user"),
            new Claim(ClaimTypes.Name, "DemoUser")
        };

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
