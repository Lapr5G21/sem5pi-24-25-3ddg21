using System;
using System.Text.Json;
using Xunit;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Tests.Domain.Staffs
{
    public class StaffAvailabilitySlotsTests
    {
        [Fact]
        public void Should_CreateAvailabilitySlot_WithStartAndEndDate()
        {
            var start = DateTime.Now;
            var end = DateTime.Now.AddHours(1);
            
            var slot = new StaffAvailabilitySlots.AvailabilitySlot(start, end);
            
            Assert.Equal(start, slot.Start);
            Assert.Equal(end, slot.End);
        }

        [Fact]
        public void Should_SerializeAndDeserializeAvailabilitySlots()
        {
            var start = DateTime.Now;
            var end = start.AddHours(1);
            var slotsList = new StaffAvailabilitySlots.AvailabilitySlot[] 
            { 
                new StaffAvailabilitySlots.AvailabilitySlot(start, end) 
            };
            var slotsJson = JsonSerializer.Serialize(slotsList);

            var deserializedSlots = JsonSerializer.Deserialize<StaffAvailabilitySlots.AvailabilitySlot[]>(slotsJson);

            Assert.NotNull(deserializedSlots);
            Assert.Single(deserializedSlots);
            Assert.Equal(start, deserializedSlots[0].Start);
            Assert.Equal(end, deserializedSlots[0].End);
        }
    }
}
