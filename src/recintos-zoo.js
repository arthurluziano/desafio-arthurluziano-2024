import recintosExistentes from "./recintosExistentes.json";
import animais from "./animais.json";

class RecintosZoo {
    erro = {};

    analisaRecintos(animal, quantidade) {
        const ocupacaoRecintos = () => {
            recintosExistentes.map((recinto) => {
                let { animaisExistentes } = recinto;
                let quantidade = animaisExistentes[0].quantidade;
                let tamanho = animaisExistentes[0].tamanho;

                if (animaisExistentes.length !== 0) {
                    animaisExistentes[0].ocupacao = quantidade * tamanho;
                }

                if (isNaN(animaisExistentes[0].ocupacao)) {
                    animaisExistentes[0].ocupacao = 0;
                }
            })
        }

        const loteAnimais = (tipo, quantidade) => {
            let animal = animais.find((animal) => animal.especie === tipo);
            let recintosViaveis = [];
            ocupacaoRecintos();

            if (!animal) {
                this.erro = { erro: "Animal inválido" };
                return this.erro;
            }

            if (quantidade <= 0) {
                this.erro = { erro: "Quantidade inválida" };
                return this.erro;
            }

            if (animal.bioma.includes(" ou ")) {
                animal.bioma = animal.bioma.split(" ou ");
            }

            recintosExistentes.map((recinto) => {
                let { numero, animaisExistentes, tamanhoTotal } = recinto;
                let novaOcupacao = animal.tamanho * quantidade;
                let espacoLivre = (tamanhoTotal - animaisExistentes[0].ocupacao) - novaOcupacao;

                if (!biomaAdequado(recinto, animal)) return;
                if (animal.especie === "GAZELA" && recinto.bioma === "floresta") return;
                if (!espacoSuficiente(recinto, novaOcupacao)) return;

                if (animal.carnivoro) {
                    if (mesmaEspecie(animaisExistentes, animal) || recinto.animaisExistentes[0].ocupacao === 0 && recinto.bioma === animal.bioma) {
                        if (animal.especie === "CROCODILO" && !recinto.bioma === "rio") { return; };

                        recintosViaveis.push(`Recinto ${numero} (espaço livre: ${espacoLivre} total: ${tamanhoTotal})`)
                    }
                    this.erro = { erro: "Não há recinto viável" };
                    return this.erro;
                } else {
                    if (temCarnivoro(animaisExistentes)) return;

                    if (animal.especie === "HIPOPOTAMO" && !mesmaEspecie(animaisExistentes, animal)) {
                        if (recinto.bioma === "rio") { espacoLivre += 1; };
                        if (!recinto.bioma === "savana e rio" || !recinto.bioma.includes("rio")) return;
                    }

                    if (animal.especie === "MACACO") {
                        if (recinto.animaisExistentes[0].ocupacao === 0 && quantidade < 2) return;
                        if (!mesmaEspecie(animaisExistentes, animal) && numero === 2) { espacoLivre += 1; };
                    }

                    if (maisDeUmaEspecie(animaisExistentes) && !mesmaEspecie(animaisExistentes, animal)) {
                        espacoLivre -= 1;
                    };

                    recintosViaveis.push(`Recinto ${numero} (espaço livre: ${espacoLivre} total: ${tamanhoTotal})`)
                }
            });

            if (recintosViaveis.length === 0) {
                return { erro: "Não há recinto viável" }
            }

            return { recintosViaveis };
        }

        const biomaAdequado = (recinto, animal) => {
            return recinto.bioma.includes(animal.bioma[0]) || recinto.bioma.includes(animal.bioma[1]) || recinto.bioma === animal.bioma;
        }

        const espacoSuficiente = (recinto, novaOcupacao) => {
            return (recinto.tamanhoTotal - recinto.animaisExistentes[0].ocupacao) >= novaOcupacao;
        }

        const mesmaEspecie = (animaisExistentes, animal) => {
            return animaisExistentes[0].especie === animal.especie;
        }

        const maisDeUmaEspecie = (animaisExistentes) => {
            return animaisExistentes.length >= 1;
        }

        const temCarnivoro = (animaisExistentes) => {
            return animaisExistentes[0].especie == "LEAO" ||
                animaisExistentes[0].especie == "LEOPARDO" ||
                animaisExistentes[0].especie == "CROCODILO";
        }

        return loteAnimais(animal, quantidade);
    }
}

export { RecintosZoo as RecintosZoo };