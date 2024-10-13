namespace DDDSample1.Domain.OperationTypes
{
    public class CreatingOperationTypeDto
    {
        public string Name { get; set; }

        public int EstimatedTimeDuration { get; set; }
        
        public int AnesthesiaTime { get; set; }
        
        public int SurgeryTime { get; set; }
        
        public int CleaningTime { get; set; }
        

        public CreatingOperationTypeDto(string name, int estimatedTimeDuration, int anesthesiaTime, int surgeryTime, int cleaningTime)
        {
            this.Name = name;
            this.EstimatedTimeDuration = estimatedTimeDuration;
            this.AnesthesiaTime = anesthesiaTime;
            this.SurgeryTime = surgeryTime;
            this.CleaningTime = cleaningTime;
        }
    }
}