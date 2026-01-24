using BatchRunner;
using System.Diagnostics;

Console.WriteLine("== Batch Runner (C#) ==");
var settings = Settings.Parse(args);
Console.WriteLine($"Configured for {settings.Count:N0} items, parallelism={settings.Parallelism}, reportEvery={settings.ReportEvery}");

var items = GenerateItems(settings.Count);
var processor = new BatchProcessor(settings.Parallelism, settings.ReportEvery, settings.SimulatedWork, settings.ChannelCapacity);

var summary = await processor.ProcessAsync(items);
Console.WriteLine($"Completed {summary.TotalProcessed:N0} items in {summary.Elapsed.TotalSeconds:F2}s");

static IEnumerable<WorkItem> GenerateItems(int count)
{
    for (var i = 1; i <= count; i++)
    {
        yield return new WorkItem(i, $"payload-{i}");
    }
}

internal sealed record Settings(
    int Count,
    int Parallelism,
    int ReportEvery,
    TimeSpan SimulatedWork,
    int ChannelCapacity)
{
    public static Settings Parse(string[] args)
    {
        var count = ReadInt(args, "--count", "BATCH_COUNT", 50_000);
        var parallel = ReadInt(args, "--parallel", "BATCH_PARALLEL", Environment.ProcessorCount);
        var report = ReadInt(args, "--report-every", "BATCH_REPORT_EVERY", 1_000);
        var workMs = ReadInt(args, "--work-ms", "BATCH_WORK_MS", 5);
        var capacity = ReadInt(args, "--channel-capacity", "BATCH_CHANNEL_CAPACITY", 10_000);
        return new Settings(count, parallel, report, TimeSpan.FromMilliseconds(workMs), capacity);
    }

    private static int ReadInt(string[] args, string flag, string env, int fallback)
    {
        var fromArg = args.FirstOrDefault(a => a.StartsWith(flag, StringComparison.OrdinalIgnoreCase));
        if (fromArg != null && int.TryParse(fromArg.Split('=').Last(), out var parsed))
        {
            return parsed;
        }

        var fromEnv = Environment.GetEnvironmentVariable(env);
        if (int.TryParse(fromEnv, out var envValue))
        {
            return envValue;
        }

        return fallback;
    }
}
