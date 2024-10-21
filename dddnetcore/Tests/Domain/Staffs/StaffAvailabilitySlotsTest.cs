using System;
using Xunit;
using DDDSample1.Domain.Staffs;

namespace DDDSample1.Domain.Staffs.Test
{
    public class StaffAvailabilitySlotsTests
    {
        [Fact]
        public void AddSlotValidSlotTest()
        {
            var availabilitySlots = new StaffAvailabilitySlots();
            availabilitySlots.AddSlot(new DateTime(2024, 10, 19, 9, 0, 0), new DateTime(2024, 10, 19, 10, 0, 0));

            Assert.Single(availabilitySlots.Slots);
            Assert.Equal(new DateTime(2024, 10, 19, 9, 0, 0), availabilitySlots.Slots[0].Start);
            Assert.Equal(new DateTime(2024, 10, 19, 10, 0, 0), availabilitySlots.Slots[0].End);
        }

        [Fact]
        public void AddSlotOverlappingSlotTest()
        {
            var availabilitySlots = new StaffAvailabilitySlots();
            availabilitySlots.AddSlot(new DateTime(2024, 10, 19, 9, 0, 0), new DateTime(2024, 10, 19, 10, 0, 0));

            Assert.Throws<InvalidOperationException>(() =>
                availabilitySlots.AddSlot(new DateTime(2024, 10, 19, 9, 30, 0), new DateTime(2024, 10, 19, 10, 30, 0)));
        }

        [Fact]
        public void AddSlotInvalidStartTimeTest()
        {
            var availabilitySlots = new StaffAvailabilitySlots();
            Assert.Throws<ArgumentException>(() =>
                availabilitySlots.AddSlot(new DateTime(2024, 10, 19, 10, 0, 0), new DateTime(2024, 10, 19, 9, 0, 0)));
        }

        [Fact]
        public void SerializeSlotsTest()
        {
            var availabilitySlots = new StaffAvailabilitySlots();
            availabilitySlots.AddSlot(new DateTime(2024, 10, 19, 9, 0, 0), new DateTime(2024, 10, 19, 10, 0, 0));

            var serialized = availabilitySlots.SerializeSlots();
            Assert.NotNull(serialized);
        }

        [Fact]
        public void DeserializeSlotsTest()
        {
            var availabilitySlots = new StaffAvailabilitySlots();
            availabilitySlots.AddSlot(new DateTime(2024, 10, 19, 9, 0, 0), new DateTime(2024, 10, 19, 10, 0, 0));

            var json = availabilitySlots.SerializeSlots();
            var deserializedSlots = StaffAvailabilitySlots.DeserializeSlots(json);

            Assert.Single(deserializedSlots.Slots);
            Assert.Equal(availabilitySlots.Slots[0].Start, deserializedSlots.Slots[0].Start);
            Assert.Equal(availabilitySlots.Slots[0].End, deserializedSlots.Slots[0].End);
        }

        [Fact]
        public void DeserializeSlotsEmptyJsonTest()
        {
            var deserializedSlots = StaffAvailabilitySlots.DeserializeSlots(string.Empty);
            Assert.Empty(deserializedSlots.Slots);
        }
    }
}
