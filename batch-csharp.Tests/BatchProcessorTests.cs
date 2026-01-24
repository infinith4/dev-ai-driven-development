using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BatchRunner;
using Xunit;

namespace BatchRunner.Tests;

public class BatchProcessorTests
{
    [Fact]
    public async Task ProcessAsync_Completes_All_Items()
    {
        var items = Enumerable.Range(1, 200)
            .Select(i => new WorkItem(i, $"payload-{i}"));

        var processor = new BatchProcessor(degreeOfParallelism: 4, reportEvery: 500, simulatedWork: TimeSpan.Zero);

        var summary = await processor.ProcessAsync(items);

        Assert.Equal(200, summary.TotalProcessed);
        Assert.True(summary.Elapsed >= TimeSpan.Zero);
    }

    [Fact]
    public async Task ProcessAsync_Continues_When_Item_Fails()
    {
        var items = new List<WorkItem>
        {
            new(1, "ok-1"),
            new(2, ""), // invalid payload triggers exception
            new(3, "ok-3"),
            new(4, "ok-4"),
        };

        var processor = new BatchProcessor(degreeOfParallelism: 2, reportEvery: 10, simulatedWork: TimeSpan.Zero);

        var summary = await processor.ProcessAsync(items);

        Assert.Equal(3, summary.TotalProcessed); // only the invalid payload should be skipped
        Assert.True(summary.Elapsed >= TimeSpan.Zero);
    }
}
