:- dynamic surgery_id/2.
:- dynamic surgery_penalty/3.
 

:- dynamic max_time/1.
:-dynamic generations/1.
:-dynamic valid_value/1.
:-dynamic population/1.
:-dynamic prob_crossover/1.
:-dynamic prob_mutation/1.
:-dynamic crossover_type/1.
:-dynamic selection_method/1.
 
agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).
agenda_staff(d004,20241028,[(850,900,m02),(940,980,c04)]).
 
timetable(d001,20241028,(0,1200)).
timetable(d002,20241028,(0,1440)).
timetable(d003,20241028,(0,1320)).
timetable(d004,20241028,(0,1020)).
 
staff(d001,doctor,orthopaedist,[so2,so3,so4]).
staff(d002,doctor,orthopaedist,[so2,so3,so4]).
staff(d003,doctor,orthopaedist,[so2,so3,so4]).

 
%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).
 
surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).
 
surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
%surgery_id(so100004,so2).
%surgery_id(so100005,so4).
%surgery_id(so100006,so2).
%surgery_id(so100007,so3).
%surgery_id(so100008,so2).
%surgery_id(so100009,so2).
%surgery_id(so100010,so2).
%surgery_id(so100011,so4).
%surgery_id(so100012,so2).
%surgery_id(so100013,so2).
 
assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
%assignment_surgery(so100004,d001).
%assignment_surgery(so100004,d002).
%assignment_surgery(so100005,d002).
%assignment_surgery(so100005,d003).
%assignment_surgery(so100006,d001).
%assignment_surgery(so100007,d003).
%assignment_surgery(so100008,d004).
%assignment_surgery(so100008,d003).
%assignment_surgery(so100009,d002).
%assignment_surgery(so100009,d004).
%assignment_surgery(so100010,d003).
%assignment_surgery(so100011,d001).
%assignment_surgery(so100012,d001).
%assignment_surgery(so100013,d004).
 
agenda_operation_room(or1,20241028,[]).
%agenda_operation_room(or2,20241028,[(520,579,so100000),(1000,1059,so099999)]).
 
% NEW
% --------------------------------------------------------------------------
 
% ! Utilizar o operation room para alocar as cirurgias, agenda_operation_room
 
% parameters initialization
initialize:-
  write('Maximum time before stop (in seconds): '),read(Time),
  (retract(max_time(_));true), asserta(max_time(Time)),
  write('Number of generations before stop: '),read(NG),
  (retract(generations(_));true), asserta(generations(NG)),
  write('Value considered valid:'), read(ValidValue),
  (retract(valid_value(_));true), asserta(valid_value(ValidValue)),
  write('Population size: '),read(PS),
  (retract(population(_));true), asserta(population(PS)),
  write('Selection method (elitist/non-elitist):'), read(SelectionMethod),
  (SelectionMethod = elitist ; SelectionMethod = non-elitist),
  % Remove old value and assert new one
  (retract(selection_method(_));true), 
  asserta(selection_method(SelectionMethod)),
  write('Crossover mode (random/sequential):'), read(CrossoverType),
  (CrossoverType = random ; CrossoverType = sequential),
  % Remove old value and assert new one
  (retract(crossover_type(_));true), 
  asserta(crossover_type(CrossoverType)),
  write('Probability of crossover (%):'), read(P1),
  PC is P1/100,
  (retract(prob_crossover(_));true),    asserta(prob_crossover(PC)),
  write('Probability of mutation (%):'), read(P2),
  PM is P2/100,
  (retract(prob_mutation(_));true), asserta(prob_mutation(PM)).
 
 
generate:-
  initialize,
  get_time(StartTime),
  %nl,write('###   ADEUS   ###'),nl,
  generate_population(Pop),
  %nl,write('###   OLA   ###'),nl,
  write('Pop='),write(Pop),nl,
  evaluate_population(Pop,PopValue),
  write('PopValue='),write(PopValue),nl,
  order_population(PopValue,PopOrd),
  generations(NG),
  valid_value(ValidValue),
  max_time(MaxTime),
  generate_generation(0,NG,ValidValue,PopOrd,0,StartTime,MaxTime).
 
 
generate_population(Pop):-
  population(PopSize),
  count_surgery_ids(NumT), % ! Substituir por um contador de surgeries 
 
  % Add surgery_penalty facts
  create_surgery_penalties,
  findall(Surgery,surgery_penalty(Surgery,_,_),SurgeriesList), % ! Substituir para utilizar surgeries 
 
  generate_population(PopSize,SurgeriesList,NumT,Pop).
 
 
% Count the number of surgeries
count_surgery_ids(Count) :-
  findall((A, B), surgery_id(A, B), List),
  length(List, Count).
 
 
% Add the surgery penalty fact
create_surgery_penalties :-
  forall(surgery_id(Surgery, Type),
  assertz(surgery_penalty(Surgery, Type, 0))).
 
 
generate_population(0,_,_,[]):-!.
generate_population(PopSize,SurgeriesList,NumT,[Ind|Rest]):-
  PopSize1 is PopSize-1,
  generate_population(PopSize1,SurgeriesList,NumT,Rest),
  generate_individual(SurgeriesList,NumT,Ind),
  not(member(Ind,Rest)).
generate_population(PopSize,SurgeriesList,NumT,L):-
  generate_population(PopSize,SurgeriesList,NumT,L).
 
 
generate_individual([G],1,[G]):-!.
 
generate_individual(SurgeriesList,NumT,[G|Rest]):-
  NumTemp is NumT + 1, % to use with random
  random(1,NumTemp,N),
  remove(N,SurgeriesList,G,NewList),
  NumT1 is NumT-1,
  generate_individual(NewList,NumT1,Rest).
 
 
remove(1,[G|Rest],G,Rest).
remove(N,[G1|Rest],G,[G1|Rest1]):- N1 is N-1,
  remove(N1,Rest,G,Rest1).
 
 
evaluate_population([],[]).
evaluate_population([Ind|Rest],[Ind*V|Rest1]):-
  evaluate(Ind,V),
  evaluate_population(Rest,Rest1).
 
 
evaluate(Seq,V):- evaluate(Seq,0,V).
 
evaluate([ ],_,0).
 
% ! Evaluate using surgery time 
evaluate([Surgery|Rest], TotalTime, V) :-
  valid_value(ValidValue),
 
  surgery_penalty(Surgery, SurgeryName, Penalty),
  surgery_time(SurgeryName, SurgeryTime),
 
  NewTotalTime is TotalTime + SurgeryTime,
 
  % Check if the total time is within the valid value
  ( NewTotalTime =< ValidValue ->
    % Within the limit, continue evaluation
    evaluate(Rest, NewTotalTime, VRest),
    V is NewTotalTime + VRest + Penalty
  ; 
    % Outside the limit, increment the penalty with the exceeded time
    ExceedPenalty is Penalty + (NewTotalTime - ValidValue),
    evaluate(Rest, NewTotalTime, VRest),
    V is NewTotalTime + VRest + ExceedPenalty
  ).
 
 
% Calculate the total time of a surgery
surgery_time(SurgeryName, TotalTime) :-
  surgery(SurgeryName, Time1, Time2, Time3),
  TotalTime is Time1 + Time2 + Time3.
 
 
order_population(PopValue,PopValueOrd):-
  bsort(PopValue,PopValueOrd).
 
 
bsort([X],[X]):-!.
bsort([X|Xs],Ys):-
  bsort(Xs,Zs),
  bchange([X|Zs],Ys).
 
 
bchange([X],[X]):-!.
 
bchange([X*VX,Y*VY|L1],[Y*VY|L2]):-
  VX>VY,!,
  bchange([X*VX|L1],L2).
 
bchange([X|L1],[X|L2]):-bchange(L1,L2).
 
 
% Generate the next generation
generate_generation(_, _, _, Pop, Counter, StartTime, MaxTime) :-
  get_time(CurrentTime),
  ElapsedTime is CurrentTime - StartTime,
  ElapsedTime > MaxTime, !,  % Stop condition if elapsed time exceeds MaxTime
  nl, write('Terminating due to time limit!'), nl,
  write('Final Generation '), write(Counter), write(':'), nl, write(Pop), nl.
 
generate_generation(G, G, _, Pop, Counter, _, _) :- !,
  nl, write('Final Generation '), write(Counter), write(':'), nl, write(Pop), nl.
 
generate_generation(N, G, ValidValue, Pop, Counter, StartTime, MaxTime) :-
  nl, write('Generation '), write(Counter), write(':'), nl, write(Pop), nl,
 
  % Identify the best individual from the current population
  Pop = [Best*BestValue|_],
  write('Best individual: '), write(Best), write(' with Value: '), write(BestValue), nl,
 
  % Perform genetic operations
  crossover_type(Mode),
  crossover(Pop, NPop1, Mode),
  mutation(NPop1, NPop),
 
  % Evaluate and order the new population
  evaluate_population(NPop, NPopValue),
  order_population(NPopValue, NPopOrd),
 
  write('New population'), write(NPopOrd), nl,
 
  % Compare the best from current and new population
  NPopOrd = [_NewBest*NewBestValue|_],
  (NewBestValue @=< BestValue
    -> FinalPop = NPopOrd,  % Keep new population if no improvement
 
      % Increase only if the BestValue is =< ValidValue
      (BestValue @=< ValidValue
        -> N1 is N + 1,
        % debug
        write('N: '), write(N1), nl,
        write('G: '), write(G), nl,
        write('Valid value: '), write(ValidValue), nl
        ;
        N1 is 0
      ),
      nl, write('NewBest value:'), write(NewBestValue), nl,
      write('Best value:'), write(BestValue), nl
    ;  include_best(Best*BestValue, NPopOrd, FinalPop),  % Preserve best individual
      N1 is 0, % Reset if there is a new best number
      nl, write('NewBest value:'), write(NewBestValue), nl,
      write('Best value:'), write(BestValue), nl
  ),
 
  Counter1 is Counter + 1,
 
  generate_generation(N1, G, ValidValue, FinalPop, Counter1, StartTime, MaxTime).
 
 
% Modified include_best to use the selected method
include_best(Best*BestValue, Population, FinalPopulation) :-
  selection_method(Method),
  (Method = elitist 
    -> include_best_elitist(Best*BestValue, Population, FinalPopulation)
    ; include_best_non_elitist(Best*BestValue, Population, FinalPopulation)
  ).
 
% Elitist 
include_best_elitist(Best*BestValue, Population, FinalPopulation) :-
  % Remove the worst individual from the population
  append(Front, [_|Rest], Population),
  append(Front, Rest, TempPopulation),
  % Insert the best individual at the start
  append([Best*BestValue], TempPopulation, FinalPopulation).
 
% Non-elitist 
include_best_non_elitist(Best*BestValue, Population, FinalPopulation) :-
  % Always keep the best individual
  population(_PS),  % Get population size
  random(0.0, 1.0, R),  % Generate random number between 0 and 1
 
  % 80% Best individual, 20% Tournament selection
  (R < 0.8 ->
    % Elitist approach - keep the best
    append(Front, [_|Rest], Population),
    append(Front, Rest, TempPopulation),
    append([Best*BestValue], TempPopulation, FinalPopulation)
  ;
    % Tournament selection
    tournament_selection(Population, 3, Selected),
    append(Front, [_|Rest], Population),
    append(Front, Rest, TempPopulation),
    append([Selected], TempPopulation, FinalPopulation)
  ).
 
% Tournament selection
tournament_selection(Population, TournamentSize, Selected) :-
  length(Population, PopLen),
  tournament_select(Population, PopLen, TournamentSize, Selected).
 
tournament_select(Population, PopLen, TournamentSize, Selected) :-
  % Select random individuals for tournament
  select_random_individuals(Population, PopLen, TournamentSize, Tournament),
  % Select winner (20% chance to select worst from tournament)
  random(0.0, 1.0, R),
  (R < 0.2 ->
    % Select worst from tournament
    last(Tournament, Selected)
  ;
    % Select best from tournament
    Tournament = [Selected|_]
  ).
 
% Select random individuals for tournament
select_random_individuals(_, _, 0, []) :- !.
select_random_individuals(Population, PopLen, N, [Selected|Rest]) :-
  N > 0,
  random(0, PopLen, Index),
  nth0(Index, Population, Selected),
  N1 is N - 1,
  select_random_individuals(Population, PopLen, N1, Rest).
 
% Helper predicates
last([X], X) :- !.
last([_|T], X) :- last(T, X).
 
nth0(0, [H|_], H) :- !.
nth0(N, [_|T], X) :- N1 is N-1, nth0(N1, T, X).
 
 
generate_crossover_points(P1,P2,Mode):-
  (var(Mode) -> crossover_type(UseMode) ; UseMode = Mode),
  generate_crossover_points1(P1,P2,UseMode).
 
generate_crossover_points1(P1,P2,random):-
  count_surgery_ids(N), % ! Utilizar o contador de surgeries (FEITO)
  NTemp is N+1,
  random(1,NTemp,P11),
  random(1,NTemp,P21),
  P11\==P21,!,
  ((P11<P21,!,P1=P11,P2=P21);P1=P21,P2=P11).
generate_crossover_points1(P1,P2,random):-
  generate_crossover_points1(P1,P2,random).
 
generate_crossover_points1(P1,P2,sequential):-
  count_surgery_ids(N), % ! Utilizar o contador de surgeries (FEITO)
  P1 is 1,  % First point always at position 1
  P2 is N.  % Second point always at last position
 
 
crossover([ ],[ ],_).
crossover([Ind*_],[Ind],_).
crossover([Ind1*_,Ind2*_|Rest],[NInd1,NInd2|Rest1],Mode):-
  generate_crossover_points(P1,P2,Mode),
  prob_crossover(Pcruz),random(0.0,1.0,Pc),
  ((Pc =< Pcruz,!,
        cross(Ind1,Ind2,P1,P2,NInd1),
    cross(Ind2,Ind1,P1,P2,NInd2))
  ;
  (NInd1=Ind1,NInd2=Ind2)),
  crossover(Rest,Rest1,Mode).
 
fillh([ ],[ ]).
 
fillh([_|R1],[h|R2]):-
  fillh(R1,R2).
 
sublist(L1,I1,I2,L):-I1 < I2,!,
  sublist1(L1,I1,I2,L).
 
sublist(L1,I1,I2,L):-sublist1(L1,I2,I1,L).
 
sublist1([X|R1],1,1,[X|H]):-!, fillh(R1,H).
 
sublist1([X|R1],1,N2,[X|R2]):-!,N3 is N2 - 1,
  sublist1(R1,1,N3,R2).
 
sublist1([_|R1],N1,N2,[h|R2]):-N3 is N1 - 1,
  N4 is N2 - 1,
  sublist1(R1,N3,N4,R2).
 
rotate_right(L,K,L1):- count_surgery_ids(N), % ! Utilizar o contador de surgeries (FEITO)
  T is N - K,
  rr(T,L,L1).
 
rr(0,L,L):-!.
 
rr(N,[X|R],R2):- N1 is N - 1,
  append(R,[X],R1),
  rr(N1,R1,R2).
 
remove([],_,[]):-!.
 
remove([X|R1],L,[X|R2]):- not(member(X,L)),!,
  remove(R1,L,R2).
 
remove([_|R1],L,R2):-
  remove(R1,L,R2).
 
insert([],L,_,L):-!.
insert([X|R],L,N,L2):-
  count_surgery_ids(T), % ! Utilizar o contador de surgeries (FEITO)
  ((N>T,!,N1 is N mod T);N1 = N),
  insert1(X,N1,L,L1),
  N2 is N + 1,
  insert(R,L1,N2,L2).
 
 
insert1(X,1,L,[X|L]):-!.
insert1(X,N,[Y|L],[Y|L1]):-
  N1 is N-1,
  insert1(X,N1,L,L1).
 
cross(Ind1,Ind2,P1,P2,NInd11):-
  sublist(Ind1,P1,P2,Sub1),
  count_surgery_ids(NumT), % ! Utilizar o contador de surgeries (FEITO)
  R is NumT-P2,
  rotate_right(Ind2,R,Ind21),
  remove(Ind21,Sub1,Sub2),
  P3 is P2 + 1,
  insert(Sub2,Sub1,P3,NInd1),
  removeh(NInd1,NInd11).
 
 
removeh([],[]).
 
removeh([h|R1],R2):-!,
  removeh(R1,R2).
 
removeh([X|R1],[X|R2]):-
  removeh(R1,R2).
 
mutation([],[]).
mutation([Ind|Rest],[NInd|Rest1]):-
  prob_mutation(Pmut),
  random(0.0,1.0,Pm),
  ((Pm < Pmut,!,mutacao1(Ind,NInd));NInd = Ind),
  mutation(Rest,Rest1).
 
mutacao1(Ind,NInd):-
  crossover_type(Mode),
  generate_crossover_points(P1,P2,Mode),
  mutacao22(Ind,P1,P2,NInd).
 
mutacao22([G1|Ind],1,P2,[G2|NInd]):-
  !, P21 is P2-1,
  mutacao23(G1,P21,Ind,G2,NInd).
mutacao22([G|Ind],P1,P2,[G|NInd]):-
  P11 is P1-1, P21 is P2-1,
  mutacao22(Ind,P11,P21,NInd).
 
mutacao23(G1,1,[G2|Ind],G2,[G1|Ind]):-!.
mutacao23(G1,P,[G|Ind],G2,[G|NInd]):-
  P1 is P-1,
  mutacao23(G1,P1,Ind,G2,NInd).