namespace Demo02.Services;

public class EmailNotificationService : INotificationService
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"Gửi Email tới Admin: {message}");
    }
}
