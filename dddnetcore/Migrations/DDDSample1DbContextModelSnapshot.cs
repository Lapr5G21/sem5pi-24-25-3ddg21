﻿// <auto-generated />
using System;
using DDDSample1.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace DDDNetCore.Migrations
{
    [DbContext(typeof(DDDSample1DbContext))]
    partial class DDDSample1DbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("DDDSample1.Domain.AuditLogs.Log", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<int>("LogActionType")
                        .HasColumnType("int");

                    b.Property<int>("LogCategoryType")
                        .HasColumnType("int")
                        .HasColumnName("Category");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.ToTable("Logs");
                });

            modelBuilder.Entity("DDDSample1.Domain.Categories.Category", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("DDDSample1.Domain.Families.Family", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Families");
                });

            modelBuilder.Entity("DDDSample1.Domain.OperationRequest.OperationRequest", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("DeadlineDate")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("OperationTypeId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("PatientMedicalRecordNumber")
                        .HasColumnType("longtext");

                    b.Property<int>("PriorityLevel")
                        .HasColumnType("int");

                    b.Property<string>("StaffId")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("OperationTypeId");

                    b.ToTable("OperationRequests");
                });

            modelBuilder.Entity("DDDSample1.Domain.OperationTypes.OperationType", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<int>("AnesthesiaTime")
                        .HasColumnType("int");

                    b.Property<int>("CleaningTime")
                        .HasColumnType("int");

                    b.Property<int>("EstimatedTimeDuration")
                        .HasColumnType("int");

                    b.Property<bool>("IsActive")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<int>("SurgeryTime")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("OperationTypes");
                });

            modelBuilder.Entity("DDDSample1.Domain.OperationTypesSpecializations.OperationTypeSpecialization", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<int>("NumberOfStaff")
                        .HasColumnType("int");

                    b.Property<string>("OperationTypeId")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("SpecializationId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("OperationTypeId");

                    b.HasIndex("SpecializationId");

                    b.ToTable("OperationTypeSpecializations");
                });

            modelBuilder.Entity("DDDSample1.Domain.Patients.AnonimyzedPatient", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("AppointmentHistoryString")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("AppointmentHistory");

                    b.Property<string>("MedicalRecordString")
                        .IsRequired()
                        .HasColumnType("longtext")
                        .HasColumnName("MedicalRecord");

                    b.HasKey("Id");

                    b.ToTable("AnonimyzedPatients", (string)null);
                });

            modelBuilder.Entity("DDDSample1.Domain.Patients.Patient", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("AppointmentHistory")
                        .HasColumnType("longtext");

                    b.Property<string>("BirthDate")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("EmergencyContact")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Gender")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("MedicalRecord")
                        .HasColumnType("longtext");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("PhoneNumber")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("Patients");
                });

            modelBuilder.Entity("DDDSample1.Domain.Products.Product", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("CategoryId")
                        .HasColumnType("longtext");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("DDDSample1.Domain.Specializations.Specialization", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("SpecializationName")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("SpecializationName")
                        .IsUnique();

                    b.ToTable("Specializations");
                });

            modelBuilder.Entity("DDDSample1.Domain.Staffs.AvailabilitySlot", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("End")
                        .HasColumnType("datetime");

                    b.Property<string>("StaffId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<DateTime>("Start")
                        .HasColumnType("datetime");

                    b.HasKey("Id");

                    b.HasIndex("StaffId");

                    b.ToTable("AvailabilitySlots", (string)null);
                });

            modelBuilder.Entity("DDDSample1.Domain.Staffs.Staff", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("IsActive");

                    b.Property<string>("SpecializationId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("StaffEmail")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("StaffFirstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("StaffFullName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("StaffLastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("StaffLicenseNumber")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("StaffPhoneNumber")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("SpecializationId");

                    b.HasIndex("StaffEmail")
                        .IsUnique();

                    b.HasIndex("StaffLicenseNumber")
                        .IsUnique();

                    b.HasIndex("StaffPhoneNumber")
                        .IsUnique();

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Staffs");
                });

            modelBuilder.Entity("DDDSample1.Domain.Users.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)")
                        .HasColumnName("IsActive");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("Id")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("DDDSample1.Domain.AuditLogs.Log", b =>
                {
                    b.OwnsOne("DDDSample1.Domain.AuditLogs.LogContent", "Content", b1 =>
                        {
                            b1.Property<string>("LogId")
                                .HasColumnType("varchar(255)");

                            b1.Property<string>("Text")
                                .IsRequired()
                                .HasColumnType("longtext")
                                .HasColumnName("Content");

                            b1.HasKey("LogId");

                            b1.ToTable("Logs");

                            b1.WithOwner()
                                .HasForeignKey("LogId");
                        });

                    b.Navigation("Content");
                });

            modelBuilder.Entity("DDDSample1.Domain.OperationRequest.OperationRequest", b =>
                {
                    b.HasOne("DDDSample1.Domain.OperationTypes.OperationType", null)
                        .WithMany()
                        .HasForeignKey("OperationTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DDDSample1.Domain.OperationTypesSpecializations.OperationTypeSpecialization", b =>
                {
                    b.HasOne("DDDSample1.Domain.OperationTypes.OperationType", "OperationType")
                        .WithMany("Specializations")
                        .HasForeignKey("OperationTypeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("DDDSample1.Domain.Specializations.Specialization", "Specialization")
                        .WithMany("OperationTypes")
                        .HasForeignKey("SpecializationId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("OperationType");

                    b.Navigation("Specialization");
                });

            modelBuilder.Entity("DDDSample1.Domain.Patients.Patient", b =>
                {
                    b.HasOne("DDDSample1.Domain.Users.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("DDDSample1.Domain.Staffs.AvailabilitySlot", b =>
                {
                    b.HasOne("DDDSample1.Domain.Staffs.Staff", null)
                        .WithMany("AvailabilitySlots")
                        .HasForeignKey("StaffId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DDDSample1.Domain.Staffs.Staff", b =>
                {
                    b.HasOne("DDDSample1.Domain.Specializations.Specialization", null)
                        .WithMany()
                        .HasForeignKey("SpecializationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("DDDSample1.Domain.Users.User", null)
                        .WithOne()
                        .HasForeignKey("DDDSample1.Domain.Staffs.Staff", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("DDDSample1.Domain.OperationTypes.OperationType", b =>
                {
                    b.Navigation("Specializations");
                });

            modelBuilder.Entity("DDDSample1.Domain.Specializations.Specialization", b =>
                {
                    b.Navigation("OperationTypes");
                });

            modelBuilder.Entity("DDDSample1.Domain.Staffs.Staff", b =>
                {
                    b.Navigation("AvailabilitySlots");
                });
#pragma warning restore 612, 618
        }
    }
}
