namespace Demo02.Services;

public class TelegramNotificationService : INotificationService
{
    public void SendNotification(string message)
    {
        Console.WriteLine($"Bắn tin nhắn Telegram tới Group: {message}");
    }
}
