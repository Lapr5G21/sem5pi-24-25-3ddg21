

%-----------------------------------------------------------------------------------------------------------------------------%
%Euristica do caixeiro Viagante %
%esta Euristica vai organizar primeiro as consultas consoante %
% minimiza o tempo de uso da sala %
% maximiza a utilização eficiente do tempo da sala e doctor % 

obtain_better_sol_tsp(Room, Day, AgOpRoomBetter, LAgDoctorsBetter, TFinOp) :-
    get_time(Ti),
    asserta(better_sol(Day, Room, _, _, 1441)),
    findall(OpCode, surgery_id(OpCode, _), LOC),
    sort_surgeries_tsp(LOC, Day, Room, SortedLOC),
    schedule_surgeries_tsp(SortedLOC, Room, Day),
    retract(better_sol(Day, Room, AgOpRoomBetter, LAgDoctorsBetter, TFinOp)),
    write('Final Result: AgOpRoomBetter='), write(AgOpRoomBetter), nl,
    write('LAgDoctorsBetter='), write(LAgDoctorsBetter), nl,
    write('TFinOp='), write(TFinOp), nl,
    get_time(Tf),
    T is Tf - Ti,
    write('Solution generation time: '), write(T), nl.

sort_surgeries_tsp(Surgeries, Day, Room, SortedSurgeries) :-
    findall((OpCode, MinDistance), 
        (
            member(OpCode, Surgeries),
            surgery_id(OpCode, OpType),
            surgery(OpType, _, TSurgery, _),
            availability_operation(OpCode, Room, Day, LPossibilities, _),
            min_distance_to_schedule(LPossibilities, TSurgery, MinDistance)
        ), ScoredSurgeries),
    keysort(ScoredSurgeries, SortedPairs),
    pairs_values(SortedPairs, SortedSurgeries).

min_distance_to_schedule([], _, 1441).  % Large value for unschedulable surgeries
min_distance_to_schedule([(Tin, Tfin) | Rest], TSurgery, MinDistance) :-
    Duration is Tfin - Tin + 1,
    (Duration >= TSurgery ->
        MinDistance = 0  % Perfect fit
    ;
        min_distance_to_schedule(Rest, TSurgery, RestMinDistance),
        MinDistance is min(RestMinDistance, Tfin - Tin + 1)
    ).

schedule_surgeries_tsp([], _, _).
schedule_surgeries_tsp([OpCode | Rest], Room, Day) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, _, TSurgery, _),
    availability_operation(OpCode, Room, Day, LPossibilities, LDoctors),
    schedule_first_interval(TSurgery, LPossibilities, (TinS, TfinS)),
    retract(agenda_operation_room1(Room, Day, Agenda)),
    insert_agenda((TinS, TfinS, OpCode), Agenda, UpdatedAgenda),
    assertz(agenda_operation_room1(Room, Day, UpdatedAgenda)),
    insert_agenda_doctors((TinS, TfinS, OpCode), Day, LDoctors),
    schedule_surgeries_tsp(Rest, Room, Day).



% ----------------------------------------------------------------------------------------------------%
% Euristica para a solução mais rapida no entanto não a mais eficiente %
% organiza as cirurgias por duração e marca as mais maiores %

obtain_fast_sol(Room, Day, AgOpRoomBetter, LAgDoctorsBetter, TFinOp) :-
    get_time(Ti),
    findall(OpCode, surgery_id(OpCode, _), LOC),
    sort_surgeries_by_duration(LOC, SortedLOC),
    empty_agenda(Room, Day, InitialAgenda, InitialDoctorsAgenda),
    schedule_surgeries_fast(SortedLOC, Room, Day, InitialAgenda, InitialDoctorsAgenda, FinalAgenda, FinalDoctorsAgenda),
    AgOpRoomBetter = FinalAgenda,
    LAgDoctorsBetter = FinalDoctorsAgenda,
    calculate_final_time(FinalAgenda, TFinOp),
    write('Final Result: AgOpRoomBetter='), write(AgOpRoomBetter), nl,
    write('LAgDoctorsBetter='), write(LAgDoctorsBetter), nl,
    write('TFinOp='), write(TFinOp), nl,
    get_time(Tf),
    T is Tf - Ti,
    write('Solution generation time: '), write(T), nl.

% Inicializa a agenda vazia para a sala e para os médicos. % 


% Agenda rápida (First-Fit) com acumulação de soluções. % 
schedule_surgeries_fast([], _, _, Agenda, DoctorsAgenda, Agenda, DoctorsAgenda).
schedule_surgeries_fast([OpCode | Rest], Room, Day, CurrentAgenda, CurrentDoctorsAgenda, FinalAgenda, FinalDoctorsAgenda) :-
    surgery_id(OpCode, OpType),
    surgery(OpType, _, TSurgery, _),
    availability_operation(OpCode, Room, Day, LPossibilities, LDoctors),
    (select_first_fit_interval(TSurgery, LPossibilities, (TinS, TfinS)) ->
        insert_agenda((TinS, TfinS, OpCode), CurrentAgenda, UpdatedAgenda),
        insert_agenda_doctors((TinS, TfinS, OpCode), CurrentDoctorsAgenda, LDoctors, UpdatedDoctorsAgenda),
        schedule_surgeries_fast(Rest, Room, Day, UpdatedAgenda, UpdatedDoctorsAgenda, FinalAgenda, FinalDoctorsAgenda)
    ;
        % Caso não consiga agendar, continua com o restante.
        schedule_surgeries_fast(Rest, Room, Day, CurrentAgenda, CurrentDoctorsAgenda, FinalAgenda, FinalDoctorsAgenda)
    ).

% Insere na agenda dos médicos.
insert_agenda_doctors(_, DoctorsAgenda, [], DoctorsAgenda).
insert_agenda_doctors((TinS, TfinS, OpCode), CurrentDoctorsAgenda, [Doctor | RestDoctors], UpdatedDoctorsAgenda) :-
    update_doctor_agenda(Doctor, (TinS, TfinS, OpCode), CurrentDoctorsAgenda, TempDoctorsAgenda),
    insert_agenda_doctors((TinS, TfinS, OpCode), TempDoctorsAgenda, RestDoctors, UpdatedDoctorsAgenda).

% Atualiza a agenda de um médico.
update_doctor_agenda(Doctor, (TinS, TfinS, OpCode), CurrentDoctorsAgenda, UpdatedDoctorsAgenda) :-
    select((Doctor, Agenda), CurrentDoctorsAgenda, RemainingDoctorsAgenda),
    insert_agenda((TinS, TfinS, OpCode), Agenda, UpdatedAgenda),
    UpdatedDoctorsAgenda = [(Doctor, UpdatedAgenda) | RemainingDoctorsAgenda].

update_doctor_agenda(Doctor, (TinS, TfinS, OpCode), CurrentDoctorsAgenda, [(Doctor, [(TinS, TfinS, OpCode)]) | CurrentDoctorsAgenda]) :-
    \+ member((Doctor, _), CurrentDoctorsAgenda).

% Calcula o tempo final baseado na última operação.
calculate_final_time(FinalAgenda, TFinOp) :-
    last(FinalAgenda, (_, Tfin, _)),
    TFinOp = Tfin.

