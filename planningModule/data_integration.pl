:- module(data_integration, [
    initialize_dynamic_data/0,
    convert_and_store_data/5
]).

% Predicados dinâmicos para armazenar dados convertidos
:- dynamic surgery/4.
:- dynamic surgery_id/2.
:- dynamic assignment_surgery/2.
:- dynamic staff/4.
:- dynamic timetable/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_operation_room/3.

% Inicializa limpando dados anteriores
initialize_dynamic_data :-
    retractall(surgery(_, _, _, _)),
    retractall(surgery_id(_, _)),
    retractall(assignment_surgery(_, _)),
    retractall(staff(_, _, _, _)),
    retractall(timetable(_, _, _)),
    retractall(agenda_staff(_, _, _)),
    retractall(agenda_operation_room(_, _, _)).

% Converte e armazena todos os dados
convert_and_store_data(Surgeries, SurgeryIds, AssignmentSurgeries, Staffs, Timetables) :-
    convert_surgeries(Surgeries),
    convert_surgery_ids(SurgeryIds),
    convert_assignment_surgeries(AssignmentSurgeries),
    convert_staffs(Staffs),
    convert_timetables(Timetables).

% Converte cirurgias do formato JSON para fatos Prolog
convert_surgeries([]).
convert_surgeries([Surgery|Rest]) :-
    % Assumindo que Surgery é um dict com name, tAnesthesia, tSurgery, tCleaning
    assertz(surgery(
        Surgery.get(name), 
        Surgery.get(tAnesthesia),
        Surgery.get(tSurgery),
        Surgery.get(tCleaning)
    )),
    convert_surgeries(Rest).

% Converte IDs de cirurgia
convert_surgery_ids([]).
convert_surgery_ids([SurgeryId|Rest]) :-
    assertz(surgery_id(
        SurgeryId.get(id),
        SurgeryId.get(name)
    )),
    convert_surgery_ids(Rest).

% Converte atribuições de cirurgia
convert_assignment_surgeries([]).
convert_assignment_surgeries([Assignment|Rest]) :-
    assertz(assignment_surgery(
        Assignment.get(id),
        Assignment.get(doctorId)
    )),
    convert_assignment_surgeries(Rest).

% Converte informações da equipe
convert_staffs([]).
convert_staffs([Staff|Rest]) :-
    assertz(staff(
        Staff.get(staffId),
        Staff.get(role),
        Staff.get(specialization),
        Staff.get(operationTypeNames)
    )),
    convert_staffs(Rest).

% Converte horários
convert_timetables([]).
convert_timetables([Timetable|Rest]) :-
    % Converte o formato de hora para minutos se necessário
    assertz(timetable(
        Timetable.get(staffId),
        Timetable.get(day),
        (Timetable.get(startTime), Timetable.get(endTime))
    )),
    convert_timetables(Rest).

% Função principal para integrar com o servidor
convert_server_data(Date) :-
    % Limpa dados antigos
    initialize_dynamic_data,
    
    % Obtém dados do servidor através dos handlers HTTP
    http_handler(api(surgeries), get_surgeries, []),
    http_handler(api(surgeryids), get_surgery_ids, []),
    http_handler(api(assignmentsurgeries), get_assignment_surgeries, []),
    http_handler(api(staffs), get_staffs, []),
    http_handler(api(timetables), get_timetables, []),
    
    % Converte e armazena os dados
    convert_and_store_data(Surgeries, SurgeryIds, AssignmentSurgeries, Staffs, Timetables).