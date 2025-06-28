import pandas as pd
import matplotlib.pyplot as plt

data = pd.read_csv("penalty_results_3_Semaforo_correcto_1M.csv")

plt.figure(figsize=(10, 6))
methods = data["method"]
penalties = data["penalty"]

plt.bar(methods, penalties, color=['blue', 'green', 'orange'])
plt.xlabel("Métodos")
plt.ylabel("Penalidades")
plt.title("Comparación de Penalidades por Método (1M iteraciones)")
plt.show()