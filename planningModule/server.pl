:- module(server, []).

% HTTP libraries
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_client)).
:- use_module(library(http/http_open)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json)).


:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.
:-dynamic better_sol/5.
:- dynamic surgery/4.
:- dynamic surgery_id/2.
:- dynamic assignment_surgery/2.
:- dynamic staff/4.
:- dynamic timetable/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_operation_room/3.

backend_url('https://localhost:5001/api/').

http:location(api, '/server', []).

server(Port) :-
    http_server(http_dispatch, [port(Port)]).
    
:- http_handler(api(surgeryids), get_surgery_ids, []).
:- http_handler(api(assignmentsurgeries), get_assignment_surgeries, []).
:- http_handler(api(surgeries), get_surgeries, []).
:- http_handler(api(staffs), get_staffs, []).
:- http_handler(api(timetables), get_timetables, []).
:- http_handler(api(agendaoperationrooms), get_agenda_operation_rooms, []).
:- http_handler(api(better_solution), get_better_solution, []).

start_application :-
    server(4000), 
    
    trigger_requests.

trigger_requests :-
    writeln(user_output,'Iniciando as requisições...'),
    
    % Fazer as requisições para as APIs definidas
    get_surgery_ids(_),
    get_assignment_surgeries(_),
    get_surgeries(_),
    get_staffs(_),
    get_timetables(_),
    get_agenda_operation_rooms(_).
%-------------------------OperationTypes - SurgeryIds--------------------------%

get_surgery_ids(_Request) :-
    get_operation_types(OperationTypes),
    maplist(convert_operation_type_to_surgery_id, OperationTypes, SurgeryIds),
    maplist(convert_surgery_id_to_json, SurgeryIds, JSON_SurgeryIds),
    reply_json(json([surgery_ids = JSON_SurgeryIds]), [json_object(dict)]).

get_operation_types(OperationTypes) :-
    backend_url(URL),
    atom_concat(URL, 'operationtypes', URL_OperationTypes),
    setup_call_cleanup(
        http_open(URL_OperationTypes, In, [cert_verify_hook(cert_accept_any)]),
        (read_string(In, _, Response),
         atom_json_dict(Response, OperationTypes, [])),
        close(In)).

convert_operation_type_to_surgery_id(OperationTypeDict, surgery_id(Id, Name)) :-
    Id = OperationTypeDict.get(id),
    Name = OperationTypeDict.get(name).

convert_surgery_id_to_json(surgery_id(Id, Name), json([id = Id, name = Name])).

%-------------------------OperationRequest - AssigmentSurgery--------------------------%

get_assignment_surgeries(_Request) :-
    get_operation_requests_backend(OperationRequests),
    maplist(convert_operation_request_to_surgery_id, OperationRequests, AssignmentSurgeries),
    maplist(convert_assignment_surgery_to_json, AssignmentSurgeries, JSON_AssignmentSurgeries),
    reply_json(json([assignment_surgeries = JSON_AssignmentSurgeries]), [json_object(dict)]).

% GET OperationRequests Backend
get_operation_requests_backend(OperationRequests) :-
    backend_url(URL),
    atom_concat(URL, 'operationRequests', URL_OperationRequests),
    setup_call_cleanup(
        http_open(URL_OperationRequests, In, [cert_verify_hook(cert_accept_any)]),
        (read_string(In, _, Response),
         atom_json_dict(Response, OperationRequests, [])),
        close(In)).

% Convert OperationRequest to assignment_surgery
convert_operation_request_to_surgery_id(OperationRequestDict, assignment_surgery(Id, DoctorId)) :-
    Id = OperationRequestDict.get(id),
    DoctorId = OperationRequestDict.get(doctorId).

% Convert assignment_surgery to JSON
convert_assignment_surgery_to_json(assignment_surgery(Id, DoctorId), json([id = Id, doctorId = DoctorId])).

assignment_surgery(Id, DoctorId) :- convert_operation_request_to_surgery_id(_, assignment_surgery(Id, DoctorId)).

%-------------------------OperationTypes - Surgeries--------------------------%


get_surgeries(_Request):-
    get_operation_types(OperationTypes),
    maplist(convert_operation_type_to_surgery, OperationTypes, Surgeries),
    maplist(convert_surgery_to_json, Surgeries, JSON_Surgeries),
    reply_json(json([surgeries=JSON_Surgeries]), [json_object(dict)]).

% Convert OperationType to surgery_id
convert_operation_type_to_surgery(OperationTypeDict, surgery(Name, TAnesthesia,TSurgery,TCleaning)) :-
    Name = OperationTypeDict.get(name),
    TAnesthesia = OperationTypeDict.get(anesthesiaTime),
    TSurgery = OperationTypeDict.get(surgeryTime),
    TCleaning = OperationTypeDict.get(cleaningTime).

% Convert surgery to JSON
convert_surgery_to_json(surgery(Name, TAnesthesia, TSurgery, TCleaning), json([name=Name, tAnesthesia=TAnesthesia, tSurgery=TSurgery, tCleaning=TCleaning])).

surgery(Name, TAnesthesia,TSurgery,TCleaning) :- convert_operation_type_to_surgery(_, surgery(Name, TAnesthesia,TSurgery,TCleaning)).



%-------------------------Staffs - staffs--------------------------%

get_staffs(_Request) :-
    writeln(user_output, 'This is a debug message1'),
    get_staffs_operation_types(StaffsOperationTypes),
    writeln(user_output, 'This is a debug message2'),
    writeln(user_output, 'StaffsOperationTypes: '),
    writeln(user_output, StaffsOperationTypes),
    maplist(convert_staff_to_json, StaffsOperationTypes, StaffJsons),
    reply_json(json([staffs = StaffJsons]), [json_object(dict)]).

% GET Staffs Operation Types Backend
get_staffs_operation_types(StaffsOperationTypes) :-

    backend_url(URL),
    atom_concat(URL, 'staffs/operationtypes', URL_StaffsOperationTypes),
    setup_call_cleanup(
        http_open(URL_StaffsOperationTypes, In, [cert_verify_hook(cert_accept_any)]),
        (read_string(In, _, Response),
         atom_json_dict(Response, StaffsOperationTypes, [])),
        close(In)
    ).

% Convert staff to JSON
convert_staff_to_json(StaffDict, 
    json([staffId = StaffId, 
          role = Role, 
          specialization = Specialization, 
          operationTypeNames = OperationTypeNames])) :-
    StaffId = StaffDict.get(staffId),
    Role = StaffDict.get(role),
    Specialization = StaffDict.get(specialization),
    OperationTypeNames = StaffDict.get(operationTypeNames).

% Convert staff to JSON
convert_staff_to_json(staff(StaffId, StaffRole, SpecializationName, MatchingOperations), 
                      json([staffId = StaffId, role = StaffRole, specialization = SpecializationName, operationTypeNames = MatchingOperations])).

staff(StaffId, StaffRole, SpecializationName, MatchingOperations) :-
staff_syntax(_, staff(StaffId, StaffRole, SpecializationName, MatchingOperations)).

%-------------------------AvailabilitySlots - timetables--------------------------%

% Get timetables for all staff members
% ------------------------- TimeTable Staff ---------------------------------
:- http_handler(api(timetables), get_timetables, []).

get_timetables(_Request) :-
    get_staffs_backend(Staffs),
    findall(Timetable, 
            (member(StaffAvailabilitySlot, Staffs),
             convert_staff_availability_slot_to_timetable(StaffAvailabilitySlot, Timetable)),
        StaffTimetables),
    flatten(StaffTimetables, AllTimeTables),
    maplist(convert_timetable_to_json, AllTimeTables, JsonTimeTables),
    reply_json(json([timetables = JsonTimeTables]), [json_object(dict)]).

% GET Staffs Backend
get_staffs_backend(Staffs) :-
    backend_url(URL),
    atom_concat(URL, 'staffs/availabilitySlots', URL_Staffs),
    http_open(URL_Staffs, In, [cert_verify_hook(cert_accept_any)]),
    read_string(In, _, Response),
    atom_json_dict(Response, Staffs, []),
    close(In).

% Convert time string to minutes
time_string_to_minutes(Time, TimeInMinutes) :-
    split_string(Time, ":", "", [HourPart, MinutePart | _]),
    atom_number(HourPart, HourNumber),
    atom_number(MinutePart, MinuteNumber),
    TimeInMinutes is HourNumber * 60 + MinuteNumber.

% Convert StaffAvailabilitySlot to Timetable
convert_staff_availability_slot_to_timetable(StaffAvailabilitySlot, TimeTables) :-
    AvailabilitySlotDto = StaffAvailabilitySlot.availabilitySlotDto,
    StaffId = AvailabilitySlotDto.staffId,
    StartSlotTime = AvailabilitySlotDto.start,
    EndSlotTime = AvailabilitySlotDto.end,
    
    split_string(StartSlotTime, "T", "", [DatePortion | StartTimeComponents]),
    split_string(EndSlotTime, "T", "", [_ | EndTimeComponents]),

    split_string(DatePortion, "-", "", [Year, Month, Day]),
    atom_number(Day, DayNumber),
    atom_number(Month, MonthNumber),
    atom_number(Year, YearNumber),

    % YYYYMMDD
    FormattedDate is YearNumber * 10000 + MonthNumber * 100 + DayNumber,

    atomic_list_concat(StartTimeComponents, " ", StartTime),
    atomic_list_concat(EndTimeComponents, " ", EndTime),

    time_string_to_minutes(StartTime, StartMinutes),
    time_string_to_minutes(EndTime, EndMinutes),

    TimeTables = [timetable(StaffId, FormattedDate, (StartMinutes, EndMinutes))].

% Convert timetable to JSON
convert_timetable_to_json(timetable(StaffId, Day, (StartTime, EndTime)),
json([staffId = StaffId, day = Day, startTime = StartTime, endTime = EndTime])).

% ---------------------- Appointments - Agenda Operation Rooms ----------------------

get_agenda_operation_rooms(_Request) :-
    get_appointments_staffs_backend(Appointments),
    findall(AgendaStaff, (member(Appointment, Appointments), convert_appointment_to_agenda_staff(Appointment, AgendaStaff)),AgendasStaff),
    maplist(convert_agenda_staff_to_json, AgendasStaff, JsonAgendaStaffs),
    reply_json(json([agenda_staffs = JsonAgendaStaffs]), [json_object(dict)]).

get_appointments_staffs_backend(Appointments) :-
    backend_url(URL),
    atom_concat(URL, 'staffs/appointments', URL_Appointments),
    setup_call_cleanup(
        http_open(URL_Appointments, In, [cert_verify_hook(cert_accept_any)]),
        (read_string(In, _, Response),
         atom_json_dict(Response, Appointments, [])),
        close(In)).

% Convert Appointment Staff to Agenda Staff
convert_appointment_to_agenda_staff(Appointment, agenda_staff(StaffID, Day, AppointmentsStaff)) :-
    Appointment.staffID = StaffID,
    Appointment.day = Day,
    findall(appointment_detail(AppointmentId, StartTime, EndTime), 
        (member(AppointmentDetail, Appointment.appointmentsStaff),
         AppointmentDetail.appointmentId = AppointmentId,
         AppointmentDetail.startTime = StartTime,
         AppointmentDetail.endTime = EndTime), 
        AppointmentsStaff).

% Convert AgendaStaff to JSON Format
convert_agenda_staff_to_json(agenda_staff(StaffID, Day, AppointmentsStaff), 
    json([staffID = StaffID, day = Day, appointments = AppointmentsStaffJson])) :-
    maplist(convert_appointment_detail_to_json, AppointmentsStaff, AppointmentsStaffJson).

% Convert AppointmentDetail to JSON Format
convert_appointment_detail_to_json(appointment_detail(AppointmentId, StartTime, EndTime),
    json([appointmentId = AppointmentId, startTime = StartTime, endTime = EndTime])).

agenda_staff(StaffId, Day, Appointments) :-
    convert_agenda_staff_to_json(_, agenda_staff(StaffId, Day, Appointments)).


free_agenda0([],[(0,1440)]).
free_agenda0([(0,Tfin,_)|LT],LT1):-!,free_agenda1([(0,Tfin,_)|LT],LT1).
free_agenda0([(Tin,Tfin,_)|LT],[(0,T1)|LT1]):- T1 is Tin-1,
    free_agenda1([(Tin,Tfin,_)|LT],LT1).
 
free_agenda1([(_,Tfin,_)],[(T1,1440)]):-Tfin\==1440,!,T1 is Tfin+1.
free_agenda1([(_,_,_)],[]).
free_agenda1([(_,T,_),(T1,Tfin2,_)|LT],LT1):-Tx is T+1,T1==Tx,!,
    free_agenda1([(T1,Tfin2,_)|LT],LT1).
free_agenda1([(_,Tfin1,_),(Tin2,Tfin2,_)|LT],[(T1,T2)|LT1]):-T1 is Tfin1+1,T2 is Tin2-1,
    free_agenda1([(Tin2,Tfin2,_)|LT],LT1).
 
 
adapt_timetable(D,Date,LFA,LFA2):-timetable(D,Date,(InTime,FinTime)),treatin(InTime,LFA,LFA1),treatfin(FinTime,LFA1,LFA2).
 
treatin(InTime,[(In,Fin)|LFA],[(In,Fin)|LFA]):-InTime=<In,!.
treatin(InTime,[(_,Fin)|LFA],LFA1):-InTime>Fin,!,treatin(InTime,LFA,LFA1).
treatin(InTime,[(_,Fin)|LFA],[(InTime,Fin)|LFA]).
treatin(_,[],[]).
 
treatfin(FinTime,[(In,Fin)|LFA],[(In,Fin)|LFA1]):-FinTime>=Fin,!,treatfin(FinTime,LFA,LFA1).
treatfin(FinTime,[(In,_)|_],[]):-FinTime=<In,!.
treatfin(FinTime,[(In,_)|_],[(In,FinTime)]).
treatfin(_,[],[]).
 
 
intersect_all_agendas([Name],Date,LA):-!,availability(Name,Date,LA).
intersect_all_agendas([Name|LNames],Date,LI):-
    availability(Name,Date,LA),
    intersect_all_agendas(LNames,Date,LI1),
    intersect_2_agendas(LA,LI1,LI).
 
intersect_2_agendas([],_,[]).
intersect_2_agendas([D|LD],LA,LIT):-	intersect_availability(D,LA,LI,LA1),
					intersect_2_agendas(LD,LA1,LID),
					append(LI,LID,LIT).
 
intersect_availability((_,_),[],[],[]).
 
intersect_availability((_,Fim),[(Ini1,Fim1)|LD],[],[(Ini1,Fim1)|LD]):-
		Fim<Ini1,!.
 
intersect_availability((Ini,Fim),[(_,Fim1)|LD],LI,LA):-
		Ini>Fim1,!,
		intersect_availability((Ini,Fim),LD,LI,LA).
 
intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)],[(Fim,Fim1)|LD]):-
		Fim1>Fim,!,
		min_max(Ini,Ini1,_,Imax),
		min_max(Fim,Fim1,Fmin,_).
 
intersect_availability((Ini,Fim),[(Ini1,Fim1)|LD],[(Imax,Fmin)|LI],LA):-
		Fim>=Fim1,!,
		min_max(Ini,Ini1,_,Imax),
		min_max(Fim,Fim1,Fmin,_),
		intersect_availability((Fim1,Fim),LD,LI,LA).
 
 
min_max(I,I1,I,I1):- I<I1,!.
min_max(I,I1,I1,I).
 
 
 
 
schedule_all_surgeries(Room,Day):-
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Or,Date,Agenda),assert(agenda_operation_room1(Or,Date,Agenda)),
    findall(_,(agenda_staff1(D,Date,L),free_agenda0(L,LFA),adapt_timetable(D,Date,LFA,LFA2),assertz(availability(D,Date,LFA2))),_),
    findall(OpCode,surgery_id(OpCode,_),LOpCode),
 
    availability_all_surgeries(LOpCode,Room,Day),!.
 
availability_all_surgeries([],_,_).
availability_all_surgeries([OpCode|LOpCode],Room,Day):-
    surgery_id(OpCode,OpType),surgery(OpType,_,TSurgery,_),
    availability_operation(OpCode,Room,Day,LPossibilities,LDoctors),
    schedule_first_interval(TSurgery,LPossibilities,(TinS,TfinS)),
    retract(agenda_operation_room1(Room,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assertz(agenda_operation_room1(Room,Day,Agenda1)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors),
    availability_all_surgeries(LOpCode,Room,Day).
 
 
 
availability_operation(OpCode,Room,Day,LPossibilities,LDoctors):-surgery_id(OpCode,OpType),surgery(OpType,_,TSurgery,_),
    findall(Doctor,assignment_surgery(OpCode,Doctor),LDoctors),
    intersect_all_agendas(LDoctors,Day,LA),
    agenda_operation_room1(Room,Day,LAgenda),
    free_agenda0(LAgenda,LFAgRoom),
    intersect_2_agendas(LA,LFAgRoom,LIntAgDoctorsRoom),
    remove_unf_intervals(TSurgery,LIntAgDoctorsRoom,LPossibilities).
 
 
remove_unf_intervals(_,[],[]).
remove_unf_intervals(TSurgery,[(Tin,Tfin)|LA],[(Tin,Tfin)|LA1]):-DT is Tfin-Tin+1,TSurgery=<DT,!,
    remove_unf_intervals(TSurgery,LA,LA1).
remove_unf_intervals(TSurgery,[_|LA],LA1):- remove_unf_intervals(TSurgery,LA,LA1).
 
 
schedule_first_interval(TSurgery,[(Tin,_)|_],(Tin,TfinS)):-
    TfinS is Tin + TSurgery - 1.
 
insert_agenda((TinS,TfinS,OpCode),[],[(TinS,TfinS,OpCode)]).
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(TinS,TfinS,OpCode),(Tin,Tfin,OpCode1)|LA]):-TfinS<Tin,!.
insert_agenda((TinS,TfinS,OpCode),[(Tin,Tfin,OpCode1)|LA],[(Tin,Tfin,OpCode1)|LA1]):-insert_agenda((TinS,TfinS,OpCode),LA,LA1).
 
insert_agenda_doctors(_,_,[]).
insert_agenda_doctors((TinS,TfinS,OpCode),Day,[Doctor|LDoctors]):-
    retract(agenda_staff1(Doctor,Day,Agenda)),
    insert_agenda((TinS,TfinS,OpCode),Agenda,Agenda1),
    assert(agenda_staff1(Doctor,Day,Agenda1)),
    insert_agenda_doctors((TinS,TfinS,OpCode),Day,LDoctors).
 
 
 
obtain_better_sol(Room,Day,AgOpRoomBetter,LAgDoctorsBetter,TFinOp):-
        get_time(Ti),
		(obtain_better_sol1(Room,Day);true),
		retract(better_sol(Day,Room,AgOpRoomBetter,LAgDoctorsBetter,TFinOp)),
            write('Final Result: AgOpRoomBetter='),write(AgOpRoomBetter),nl,
            write('LAgDoctorsBetter='),write(LAgDoctorsBetter),nl,
            write('TFinOp='),write(TFinOp),nl,
		get_time(Tf),
		T is Tf-Ti,
		write('Tempo de geracao da solucao:'),write(T),nl.
 
 
obtain_better_sol1(Room,Day):-
    asserta(better_sol(Day,Room,_,_,1441)),
    findall(OpCode,surgery_id(OpCode,_),LOC),!,
    permutation(LOC,LOpCode),
    retractall(agenda_staff1(_,_,_)),
    retractall(agenda_operation_room1(_,_,_)),
    retractall(availability(_,_,_)),
    findall(_,(agenda_staff(D,Day,Agenda),assertz(agenda_staff1(D,Day,Agenda))),_),
    agenda_operation_room(Room,Day,Agenda),assert(agenda_operation_room1(Room,Day,Agenda)),
    findall(_,(agenda_staff1(D,Day,L),free_agenda0(L,LFA),adapt_timetable(D,Day,LFA,LFA2),assertz(availability(D,Day,LFA2))),_),
    availability_all_surgeries(LOpCode,Room,Day),
    agenda_operation_room1(Room,Day,AgendaR),
		update_better_sol(Day,Room,AgendaR,LOpCode),
		fail.
 
update_better_sol(Day,Room,Agenda,LOpCode):-
                better_sol(Day,Room,_,_,FinTime),
                reverse(Agenda,AgendaR),
                evaluate_final_time(AgendaR,LOpCode,FinTime1),
             write('Analysing for LOpCode='),write(LOpCode),nl,
             write('now: FinTime1='),write(FinTime1),write(' Agenda='),write(Agenda),nl,
		FinTime1<FinTime,
             write('best solution updated'),nl,
                retract(better_sol(_,_,_,_,_)),
                findall(Doctor,assignment_surgery(_,Doctor),LDoctors1),
                remove_equals(LDoctors1,LDoctors),
                list_doctors_agenda(Day,LDoctors,LDAgendas),
		asserta(better_sol(Day,Room,Agenda,LDAgendas,FinTime1)).
 
evaluate_final_time([],_,1441).
evaluate_final_time([(_,Tfin,OpCode)|_],LOpCode,Tfin):-member(OpCode,LOpCode),!.
evaluate_final_time([_|AgR],LOpCode,Tfin):-evaluate_final_time(AgR,LOpCode,Tfin).
 
list_doctors_agenda(_,[],[]).
list_doctors_agenda(Day,[D|LD],[(D,AgD)|LAgD]):-agenda_staff1(D,Day,AgD),list_doctors_agenda(Day,LD,LAgD).
 
remove_equals([],[]).
remove_equals([X|L],L1):-member(X,L),!,remove_equals(L,L1).
remove_equals([X|L],[X|L1]):-remove_equals(L,L1).