using demo02.Data;
using demo02.Models;
using demo02.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Ganss.Xss;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddValidatorsFromAssemblyContaining<UserValidator>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.DocumentTitle = "Demo 02 Security API Docs";
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Demo 02 Security API v1");
    });
}

app.MapPost("/users", Program.CreateUserAsync)
    .WithName("CreateUser")
    .WithTags("Users")
    .WithSummary("Tạo mới người dùng sau khi kiểm tra dữ liệu đầu vào.")
    .WithDescription("Áp dụng FluentValidation cho Username, Email và Age. Phù hợp với các kịch bản 1 đến 4 trong README: tạo user hợp lệ, username quá ngắn, email sai định dạng và tuổi ngoài khoảng 18-99.")
    .Accepts<User>("application/json")
    .Produces<User>(StatusCodes.Status200OK)
    .ProducesValidationProblem(StatusCodes.Status400BadRequest);

app.MapGet("/persons/{personId:int:min(1)}/age/{age:min(0):max(120)}", Program.ValidateRouteConstraints)
    .WithName("ValidateRouteConstraints")
    .WithTags("Route Constraints")
    .WithSummary("Kiểm tra route parameters bằng route constraints.")
    .WithDescription("Endpoint minh họa các ràng buộc trên URL: personId phải >= 1, age phải từ 0 đến 120. Tương ứng với các kịch bản 5 đến 7 trong README.")
    .Produces<string>(StatusCodes.Status200OK)
    .Produces(StatusCodes.Status404NotFound);

app.MapPost("/posts", Program.CreatePostAsync)
    .WithName("CreatePost")
    .WithTags("Posts")
    .WithSummary("Tạo bài viết và sanitize HTML trước khi lưu.")
    .WithDescription("Endpoint dùng HtmlSanitizer để loại bỏ thẻ HTML nguy hiểm như script trước khi lưu. Phù hợp với các kịch bản 8 đến 10 trong README: post bình thường, post chứa XSS và chuỗi giống SQL Injection.")
    .Accepts<Post>("application/json")
    .Produces<Post>(StatusCodes.Status200OK);

app.Run();

/// <summary>
/// Lớp chứa các handler cho Minimal API để Swagger có thể ánh xạ metadata rõ ràng hơn.
/// </summary>
public partial class Program
{
    /// <summary>
    /// Tạo mới một người dùng sau khi kiểm tra dữ liệu đầu vào với FluentValidation.
    /// </summary>
    /// <param name="user">Thông tin người dùng nhận từ request body.</param>
    /// <param name="validator">Validator dùng để kiểm tra Username, Email và Age.</param>
    /// <param name="dbContext">DbContext dùng để lưu dữ liệu người dùng.</param>
    /// <returns>
    /// Kết quả xử lý request, bao gồm:
    /// <list type="bullet">
    /// <item><description><c>200 OK</c> nếu dữ liệu hợp lệ và lưu thành công.</description></item>
    /// <item><description><c>400 Bad Request</c> nếu dữ liệu vi phạm rule validation.</description></item>
    /// </list>
    /// </returns>
    public static async Task<IResult> CreateUserAsync(
        User user,
        IValidator<User> validator,
        AppDbContext dbContext)
    {
        var validationResult = await validator.ValidateAsync(user);

        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return Results.Ok(user);
    }

    /// <summary>
    /// Trả về thông báo xác nhận route parameters hợp lệ theo các route constraints đã khai báo.
    /// </summary>
    /// <param name="personId">Mã người dùng trên URL, phải là số nguyên và lớn hơn hoặc bằng 1.</param>
    /// <param name="age">Tuổi trên URL, phải nằm trong khoảng từ 0 đến 120.</param>
    /// <returns>Chuỗi mô tả route hợp lệ.</returns>
    public static IResult ValidateRouteConstraints(int personId, int age)
    {
        return Results.Ok($"PersonId: {personId}, Age: {age} is valid");
    }

    /// <summary>
    /// Tạo mới bài viết sau khi làm sạch nội dung HTML để giảm rủi ro XSS.
    /// </summary>
    /// <param name="post">Thông tin bài viết nhận từ request body.</param>
    /// <param name="dbContext">DbContext dùng để lưu bài viết đã sanitize.</param>
    /// <returns><c>200 OK</c> cùng bài viết sau khi đã được sanitize và lưu xuống cơ sở dữ liệu.</returns>
    public static async Task<IResult> CreatePostAsync(Post post, AppDbContext dbContext)
    {
        var sanitizer = new HtmlSanitizer();
        post.Content = sanitizer.Sanitize(post.Content);

        dbContext.Posts.Add(post);
        await dbContext.SaveChangesAsync();

        return Results.Ok(post);
    }
}
