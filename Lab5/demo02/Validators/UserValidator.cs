using demo02.Models;
using FluentValidation;

namespace demo02.Validators;

/// <summary>
/// Định nghĩa các rule kiểm tra dữ liệu đầu vào cho model <see cref="User"/>.
/// </summary>
public class UserValidator : AbstractValidator<User>
{
    /// <summary>
    /// Khởi tạo validator với các rule cho Username, Email và Age.
    /// </summary>
    public UserValidator()
    {
        RuleFor(user => user.Username)
            .NotEmpty()
            .Length(3, 20);

        RuleFor(user => user.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(user => user.Age)
            .InclusiveBetween(18, 99);
    }
}
