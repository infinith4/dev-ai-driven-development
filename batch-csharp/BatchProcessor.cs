using System.Collections.Concurrent;
using System.Diagnostics;
using System.Threading.Channels;

namespace BatchRunner;

public sealed record WorkItem(int Id, string Payload);

public sealed record BatchSummary(int TotalProcessed, TimeSpan Elapsed);

public sealed class BatchProcessor
{
    private readonly int _degreeOfParallelism;
    private readonly int _reportEvery;
    private readonly TimeSpan _simulatedWork;
    private readonly int _channelCapacity;

    public BatchProcessor(int degreeOfParallelism, int reportEvery = 500, TimeSpan? simulatedWork = null, int channelCapacity = 10_000)
    {
        _degreeOfParallelism = Math.Max(1, degreeOfParallelism);
        _reportEvery = Math.Max(1, reportEvery);
        _simulatedWork = simulatedWork ?? TimeSpan.FromMilliseconds(10);
        _channelCapacity = Math.Max(_degreeOfParallelism * 10, channelCapacity);
    }

    public async Task<BatchSummary> ProcessAsync(IEnumerable<WorkItem> items, CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();
        var processed = 0;
        var errors = new ConcurrentBag<Exception>();

        var channel = Channel.CreateBounded<WorkItem>(new BoundedChannelOptions(_channelCapacity)
        {
            SingleWriter = false,
            SingleReader = false
        });

        var writerTask = Task.Run(async () =>
        {
            try
            {
                foreach (var item in items)
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    await channel.Writer.WriteAsync(item, cancellationToken);
                }
            }
            finally
            {
                channel.Writer.Complete();
            }
        }, cancellationToken);

        var workers = Enumerable.Range(0, _degreeOfParallelism)
            .Select(workerId => Task.Run(async () =>
            {
                await foreach (var item in channel.Reader.ReadAllAsync(cancellationToken))
                {
                    try
                    {
                        await ProcessItemAsync(item, cancellationToken);
                        var current = Interlocked.Increment(ref processed);
                        if (current % _reportEvery == 0)
                        {
                            Console.WriteLine($"[{DateTime.UtcNow:O}] Processed {current:N0} items (worker {workerId})");
                        }
                    }
                    catch (Exception ex)
                    {
                        errors.Add(ex);
                    }
                }
            }, cancellationToken))
            .ToArray();

        await Task.WhenAll(workers.Concat(new[] { writerTask }));

        stopwatch.Stop();

        if (!errors.IsEmpty)
        {
            Console.WriteLine($"Encountered {errors.Count} errors; showing first:");
            Console.WriteLine(errors.First().ToString());
        }

        return new BatchSummary(processed, stopwatch.Elapsed);
    }

    private async Task ProcessItemAsync(WorkItem item, CancellationToken cancellationToken)
    {
        // TODO: replace this simulated delay with real work (I/O, CPU, etc.).
        await Task.Delay(_simulatedWork, cancellationToken);

        // Example of lightweight computation to keep the loop non-empty.
        if (item.Payload.Length == 0)
        {
            throw new InvalidOperationException("Payload must not be empty");
        }
    }
}
