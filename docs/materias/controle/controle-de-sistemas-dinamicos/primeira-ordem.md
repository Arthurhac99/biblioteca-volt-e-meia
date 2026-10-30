# Sistemas de 1ª ordem

!!! warning "Página de exemplo"
    Este resumo foi escrito como modelo para mostrar o formato das páginas. Revise, confira com seu material da disciplina e reescreva com suas palavras antes de publicar.

## Resumo em uma frase

Um sistema de 1ª ordem responde a um degrau subindo de forma exponencial, sem oscilar, e a velocidade dessa subida é ditada por um único número: a constante de tempo \(\tau\).

## Função de transferência

$$
G(s) = \frac{Y(s)}{U(s)} = \frac{K}{\tau s + 1}
$$

- \(K\): ganho estático. Quanto a saída muda, em regime, para cada unidade de entrada.
- \(\tau\): constante de tempo, em segundos. Quanto maior, mais lento o sistema.
- Polo em \(s = -1/\tau\). Se \(\tau > 0\), o polo está no semiplano esquerdo e o sistema é estável.

## Resposta ao degrau

Para uma entrada degrau de amplitude \(A\), com condições iniciais nulas:

$$
y(t) = K A \left(1 - e^{-t/\tau}\right), \quad t \ge 0
$$

| Instante | Quanto da resposta final já foi atingido |
|---|---|
| \(t = \tau\) | 63,2 % |
| \(t = 2\tau\) | 86,5 % |
| \(t = 3\tau\) | 95,0 % |
| \(t = 4\tau\) | 98,2 % |

Daí saem as regras práticas:

- **Tempo de acomodação** (critério de 2 %): \(t_s \approx 4\tau\)
- **Tempo de subida** (de 10 % a 90 %): \(t_r \approx 2{,}2\,\tau\)
- **Sem sobressinal**: a resposta nunca passa do valor final.

!!! tip "Como achar \(\tau\) num gráfico experimental"
    Aplique um degrau, espere estabilizar e veja o valor final. Depois procure no gráfico o instante em que a saída chegou a 63,2 % desse valor. Esse instante (contado a partir do degrau) é \(\tau\).

## Exemplo: circuito RC

A tensão no capacitor de um circuito RC série, alimentado por uma fonte \(V_{in}\), segue:

$$
\frac{V_C(s)}{V_{in}(s)} = \frac{1}{RC\,s + 1}
$$

Comparando com a forma padrão: \(K = 1\) e \(\tau = RC\).

Com \(R = 10\ \text{k}\Omega\) e \(C = 100\ \mu\text{F}\):

$$
\tau = RC = (10 \times 10^{3})(100 \times 10^{-6}) = 1\ \text{s}
$$

Ou seja, o capacitor chega a 63,2 % da tensão da fonte em 1 s e está praticamente carregado (98 %) em cerca de 4 s.

## Simulando em Python

[![Abrir no Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/Arthurhac99/biblioteca-volt-e-meia/blob/main/notebooks/controle/controle-de-sistemas-dinamicos/primeira-ordem.ipynb){ .colab target="_blank" }

O notebook do Colab tem a versão completa: controles deslizantes para mudar \(K\) e \(\tau\), o exemplo do circuito RC, a comparação com a biblioteca de controle do Python e como descobrir \(\tau\) a partir de dados medidos. Roda no navegador, sem instalar nada.

Abaixo, o essencial:

```python
import numpy as np
import matplotlib.pyplot as plt

K, tau, A = 1.0, 1.0, 5.0          # ganho, constante de tempo (s), degrau (V)
t = np.linspace(0, 6 * tau, 500)
y = K * A * (1 - np.exp(-t / tau))

plt.plot(t, y, label="resposta")
plt.axhline(0.632 * K * A, ls="--", c="gray", label="63,2 %")
plt.axvline(tau, ls=":", c="gray")
plt.xlabel("tempo (s)")
plt.ylabel("saída (V)")
plt.legend()
plt.grid(True)
plt.show()
```

## Onde isso aparece na prática

- Carga e descarga de capacitor (RC) e corrente num indutor (RL)
- Aquecimento de um forno ou de um resistor
- Nível de um tanque com saída livre (aproximação linear)
- Velocidade de um motor CC quando a indutância da armadura é desprezível

## Vídeos recomendados

<div class="vem-videos" data-materia="controle-de-sistemas-dinamicos"></div>

## Referências

- Livro-texto da disciplina (autor, título, capítulo)
- Notas de aula da disciplina
