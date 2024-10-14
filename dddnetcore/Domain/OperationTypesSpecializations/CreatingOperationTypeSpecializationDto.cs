namespace DDDSample1.Domain.OperationTypesSpecializations
{
    public class CreatingOperationTypeSpecializationDto
    {
        public string SpecializationId;
        public int NumberOfStaff;
        

        public CreatingOperationTypeSpecializationDto(string specializationId,int numberOfStaff){
            this.SpecializationId = specializationId;
            this.NumberOfStaff = numberOfStaff;
        }
    }
}