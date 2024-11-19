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

backend_url('https://localhost:5001/api/').

http:location(api, '/server', []).

server(Port) :-
    http_server(http_dispatch, [port(Port)]).

:- http_handler(api(surgeryids), get_surgery_ids, []).
:- http_handler(api(staffs), get_staffs, []).
:- http_handler(api(timetables), get_timetables, []).
:- http_handler(api(agendaoperationrooms), get_agenda_operation_rooms, []).

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

get_staffs(_Request) :-
    get_staffs_backend(Staffs),
    maplist(convert_staff_to_json, Staffs, StaffJsons),
    reply_json(json([staffs = StaffJsons]), [json_object(dict)]).

get_staffs_backend(Staffs) :-
        backend_url(URL),
        atom_concat(URL, 'staffs', URL_Staffs),
        setup_call_cleanup(
            http_open(URL_Staffs, In, [cert_verify_hook(cert_accept_any)]),
            (read_string(In, _, Response),
            write('Backend response: '), writeln(Response),
             atom_json_dict(Response, Staffs, [])),
        close(In)).
    

convert_staff_to_json(StaffDict, json([staffID = StaffID, specialization = Specialization])) :-
        writeln(StaffDict), 
        StaffID = StaffDict.get(staffID),
        Specialization = StaffDict.get(specializationId).
    

get_timetables(_Request) :-
    get_staffs_backend(Staffs),
    findall(Timetable, (member(Staff, Staffs), convert_staff_to_timetable(Staff, Timetable)), StaffTimetables),
    flatten(StaffTimetables, AllTimeTables),
    maplist(convert_timetable_to_json, AllTimeTables, JsonTimeTables),
    reply_json(json([timetables = JsonTimeTables]), [json_object(dict)]).

convert_staff_to_timetable(StaffDict, TimeTables) :-
    AvailabilitySlots = StaffDict.get(availabilitySlots),
    StaffId = StaffDict.get(id),
    (AvailabilitySlots \= [] ->
        findall(timetable(StaffId, FormattedDate, (StartMinutes, EndMinutes)),
                (member(AvailabilitySlot, AvailabilitySlots),
                 StartSlotTime = AvailabilitySlot.get(startTime),
                 EndSlotTime = AvailabilitySlot.get(endTime),
                 split_string(StartSlotTime, "T", "", [DatePortion | StartTimeComponents]),
                 split_string(EndSlotTime, "T", "", [_ | EndTimeComponents]),
                 split_string(DatePortion, "-", "", [Year, Month, Day]),
                 atom_number(Day, DayNumber),
                 atom_number(Month, MonthNumber),
                 atom_number(Year, YearNumber),
                 FormattedDate is YearNumber * 10000 + MonthNumber * 100 + DayNumber,
                 atomic_list_concat(StartTimeComponents, " ", StartTime),
                 atomic_list_concat(EndTimeComponents, " ", EndTime),
                 time_string_to_minutes(StartTime, StartMinutes),
                 time_string_to_minutes(EndTime, EndMinutes)),
                TimeTables);
        TimeTables = []).

% Convert time string to minutes
time_string_to_minutes(Time, TimeInMinutes) :-
    split_string(Time, ":", "", [HourPart, MinutePart | _]),
    atom_number(HourPart, HourNumber),
    atom_number(MinutePart, MinuteNumber),
    TimeInMinutes is HourNumber * 60 + MinuteNumber.

% Convert timetable to JSON
convert_timetable_to_json(timetable(StaffId, Day, (StartTime, EndTime)),
                          json([staffId = StaffId, day = Day, startTime = StartTime, endTime = EndTime])).

% Handler to fetch operation room agenda from the backend
get_agenda_operation_rooms(_Request) :-
    get_appointments_backend(Appointments),
    findall(AgendaOperationRoom,
        (member(Appointment, Appointments),
         convert_appointment_to_agenda_operation_room(Appointment, AgendaOperationRoom)),
        AgendasOperationRooms),
    maplist(agenda_operation_rooms_to_json, AgendasOperationRooms, JsonAgendaOperationRooms),
    reply_json(json([agenda_operation_rooms = JsonAgendaOperationRooms]), [json_object(dict)]).

% Fetch appointments from the backend
get_appointments_backend(Appointments) :-
    backend_url(URL),
    atom_concat(URL, 'appointments', URL_Appointments),
    setup_call_cleanup(
        http_open(URL_Appointments, In, [cert_verify_hook(cert_accept_any)]),
        (read_string(In, _, Response),
         atom_json_dict(Response, Appointments, [])),
        close(In)).

% Convert appointment data to agenda operation room format
convert_appointment_to_agenda_operation_room(AppointmentDict, agenda_operation_room(Id, RoomId, DateTime)) :-
    Id = AppointmentDict.get(id),
    RoomId = AppointmentDict.get(roomId),
    DateTime = AppointmentDict.get(dateTime).

% Convert agenda operation room to JSON
agenda_operation_rooms_to_json(agenda_operation_room(Id, RoomId, DateTime), json([id = Id, roomId = RoomId, dateTime = DateTime])).

