from typing import Tuple, Dict, List
from enum import Enum
import itertools
import random

"""
NOTES
-----
State =
    closest car position from intersection for road 1 (0-8, 9 if no cars) X
    closest car position from intersection for road 2 (0-8, 9 if no cars X
    light setting (ie 0-green, 1 red for one of the roads) X
    light delay (0-3)
 Reward -1.0 if a car is stopped at a red light on either road, zero otherwise.
 Optimise discounted sum of future reward.
 Use discount factor: gamma = .9
 Use learning rate: alpha = .1
 Epsilon-greedy exploration 10%
"""

# Parameters
ALPHA = 0.1  # Learning rate
GAMMA = 0.9  # Discount factor
EPSILON = 0.1  # Epsilon-greedy exploration

# Type hints to help understand inputs and outputs of functions
Reward = float
State = Tuple[int, int, int, int] 
Q_Table = Dict[State, List[Reward]]
# OJO el reward de indice 0 es stay el de 1 es switch 
# por ejemplo si mi estado aka clave es 9,7,1,3 pues 
# su valor puede ser -4.6 y -4.2 asi que lo que tomo seria cambiar 


class Action(Enum):
    """
    Two actions: decide to switch or not.
    """
    STAY = 0
    SWITCH = 1


class QLearningAgent:
    def __init__(self, state: State, action: Action):
        self._q_table = self._init_q_table()
        self._state = state # A: segun veo state en relaidad en sus claves contiene la tupla del espacio de estados mientras que sus valores son las recompensas
        self._action = action # A: por otro lado acction es solo un valor de enum que me permite decidir si cambiar o no
        #A: donde la primera clave corresponde al reward si action == STAY y la segunda si SWITCH
        #A su vez confirmame esto, solo existe un action en el programa y esta es la decision que se aplica sobre el estado x en ese momento, antes pensaba que habian actions para cada x de la tabla q pero eso no es asi, sino que lo que se guardan son los valores pero no la decision
        """
        Init function to generate the q_table
        :return: q_table mapping State -> List[STAY reward, SWITCH reward]
        """
    @staticmethod
    def _init_q_table() -> Q_Table: 
    
        # Define the state space
        state_to_record = (
            range(10),  # closest car position from intersection for road 1 (0-8, 9 if no cars) eje Y
            range(10),  # closest car position from intersection for road 2 (0-8, 9 if no cars) eje X
            range(2),   # light setting (ie 0-green, 1 red for one of the roads) aqui 1 es rojo para los semaforos del eje Y
            range(4)    # light delay (0-3)
        )
        _q_table = {}
        for i, j, k, l in itertools.product(*state_to_record): 
            # itertools.product aqui genero el producto carteciano 
            # para tener todos los posibles estados de mi tabla q
            _q_table[(i, j, k, l)] = [0.0, 0.0]
            # aqui para esa combinacion unica (i, j, k, l) 
            # la igualo a [0.0,0.0] el primer elemento de mi lista 
            # es el reward si no cambia y el segundo si sis
        return _q_table

    @staticmethod
    def calculate_reward(state: State) -> Reward: 
        """
        Calculate reward given a state
        :param state: current state
        :return: The reward at given state
        """
        luz_semaforo = state[2] #ojo no olvides que corresponde (AKA) es un reflejo del estado de los semaforos top y bottom y que 1 es verde en Y wiii
        # Distancia del carro mas cercano a su semaforo en Y
        car_waiting_in_top_bot_lanes = state[0] == 0 and luz_semaforo == 0  #recuerda que 1 es verde en Y por tanto aqui verifico que esta en rojo
        car_waiting_in_left_right_lanes = state[1] == 0 and luz_semaforo == 1   # same logica pero ahora en X
        car_is_waiting = car_waiting_in_top_bot_lanes or car_waiting_in_left_right_lanes 
        return -1.0 if car_is_waiting else 0

    def _choose_action(self, state: State) -> Action:
        """
        10% (EPSILON) chance of picking up random choice
        otherwise, pick action from the q_table
        :return: An action to perform
        """
        if random.uniform(0, 1) < EPSILON:
            # Randomly choose an action with probability EPSILON
            action = random.choice([Action.SWITCH, Action.STAY])
        else:
            # Otherwise, pick action with the max payoff in q_table
            q_entry = self._q_table[state] 
            #me da los rewads de STAY es [0] o SWITCH si es [1] para una clave dada por ejemplo 3,4,1,0
            # Look at two conditions to determine whether it is better to switch
            # (1) Only allow switch if time_delay == 0
            can_switch = state[3] == 0 
            # (2) It is better to switch if pay off for switching better than staying
            better_to_switch = q_entry[1] > q_entry[0] # me da los rewads de STAY es [0] o SWITCH si es [1] para una clave dada por ejemplo 3,4,1,0
            # Then, make a decision to switch or not to switch
            if can_switch and better_to_switch:
                action = Action.SWITCH
            else:
                action = Action.STAY
        return action


    #Metodo para cuando ya tengo la tabla q y no quiero que explore la tabla con aleatoriedad
    #Solo deseo que use la mejor opcion disponible siempre
    def _choose_action_stable(self, state: State) -> Action:
        q_entry = self._q_table[state] 
        can_switch = state[3] == 0 
        better_to_switch = q_entry[1] > q_entry[0]
        if can_switch and better_to_switch:
            action = Action.SWITCH
        else:
            action = Action.STAY
        return action

    def next_best_action(self, state: State): 
        """
        Main Q-learning algorithm that determines best action
        and updates the q-table
        :param state: current game's state after taking prev action
        :return: next best action
        """
        # Elige una accion utilizando 
        new_action = self._choose_action(state=state) 

        # Observe s' and r of new state
        new_state = state 
        reward = self.calculate_reward(state=state) 
        #devuelve el puntaje del estado actual
        #es -1 si tengo el top car esta detenido y 0 si no es asi

        # abreviaciones para hacer mas legible el codigo
        q = self._q_table
        s, a = self._state, self._action.value # Recibe el estado y  decision actuales 
        s_, a_ = new_state, new_action.value # Mismo estado que a pero su accion puede
        # variar dependiendo de choose_action

        # Calculate the differences between q(s',a') - q(s,a)
        #   and then, update the q_table
        q[s][a] += ALPHA * (reward + (GAMMA * q[s_][a_]) - q[s][a])  

        # ALFA representa el impacto de la nueva informacion en la actualizacion del estado s
        # GAMMA representa importancia que le doy a la ganancia futura sobre la inmediata
        # Update my internal record of state
        # Temporal difference (reward + (GAMMA * q[s_][a_]) - q[s][a])
        self._state, self._action = s_, new_action 

        # Return the new action
        return new_action

    def _debug_q_agent(self):
        import pprint
        q_table = self._q_table
        pprint.pprint([(q, q_table[q]) for q in q_table if q_table[q][0] != 0.0 or q_table[q][1] != 0.0])


if __name__ == '__main__':
    q_learning = QLearningAgent(state=(9, 9, 0, 3), action=Action.STAY)
