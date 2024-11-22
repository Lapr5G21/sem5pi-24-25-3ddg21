namespace DDDSample1.Domain.Hospital
{
  public class HospitalMap
  {
    public string GroundTextureUrl { get; set; }
    public string WallTextureUrl { get; set; }
    public Size Size { get; set; }
    public int[][] Map { get; set; }
  }
}
