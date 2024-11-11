import { ChecklistSection } from '../types/checklist';

export const checklistHygiene: ChecklistSection[] = [
  {
    titulo: "1. Instalações",
    itens: [
      {
        id: "piso",
        descricao: "Piso, em bom estado de higienização e conservação."
      },
      {
        id: "parede",
        descricao: "Parede, em bom estado de higienização e conservação."
      },
      {
        id: "teto",
        descricao: "Teto, em bom estado de higienização e conservação."
      },
      {
        id: "portas_janelas",
        descricao: "Portas e Janelas, em bom estado de higienização e conservação."
      },
      {
        id: "area_externa",
        descricao: "A área externa, limpa e organizada."
      },
      {
        id: "tomadas_disjuntores",
        descricao: "Tomadas, disjuntores e interruptores limpos e conservados."
      },
      {
        id: "janelas_aberturas",
        descricao: "Janelas e demais aberturas (exaustor, coifa e outros): livres de falhas, rachaduras, com proteção contra insetos e roedores (telas milimetradas)."
      },
      {
        id: "ventilacao",
        descricao: "Ventilação: capaz de garantir o conforto térmico e o ambiente livre de fungos, gases, fumaça e outros."
      },
      {
        id: "porta_bloqueio",
        descricao: "Porta com bloqueio para entrada de vetores e poeiras - cortina de ar e veda porta."
      }
    ]
  },
  {
    titulo: "2. Utensílios e Equipamento",
    itens: [
      {
        id: "utensilios",
        descricao: "Utensílios, em bom estado de higienização e conservação."
      },
      {
        id: "equipamentos_moveis",
        descricao: "Equipamentos, móveis de produção e equipamento, em bom estado de higienização."
      },
      {
        id: "equipamentos_suficientes",
        descricao: "Equipamento em número suficiente à atividade."
      },
      {
        id: "utensilios_superficie",
        descricao: "Utensílios com superfícies lisas, íntegras, impermeáveis, resistentes à corrosão, de fácil higienização e de material não contaminante."
      },
      {
        id: "equipamentos_conservacao",
        descricao: "Equipamentos de conservação dos alimentos: (refrigeradores, congeladores, câmaras frigoríficas e outros) com medidor de temperatura localizado em local apropriado e em adequado funcionamento."
      },
      {
        id: "planilhas_temperatura",
        descricao: "Planilhas de registro diário da temperatura atualizadas."
      },
      {
        id: "utensilios_protegidos",
        descricao: "Utensílios protegidos contra poeira após higienização."
      }
    ]
  },
  {
    titulo: "3. Manejo de Resíduos",
    itens: [
      {
        id: "retirada_residuos",
        descricao: "Retirada frequente dos resíduos da área de processamento evitando focos de contaminação. (Lixeiras cheias)"
      },
      {
        id: "segregacao_residuos",
        descricao: "Existe segregação correta de resíduos."
      },
      {
        id: "lixeiras_estado",
        descricao: "Lixeiras, em bom estado de higienização e conservação"
      },
      {
        id: "segregacao_armazenamento",
        descricao: "Segregação e o armazenamento temporário dos resíduos gerados na execução dos serviços estão seguindo procedimento operacional"
      },
      {
        id: "lixeiras_area_manipulacao",
        descricao: "Lixeiras da área de manipulação: em número suficiente para o armazenamento de todos os resíduos, dotadas de tampa e acionamento sem o uso das mãos, revestidas de sacos de lixo e em bom estado de higienização e conservação."
      }
    ]
  },
  {
    titulo: "4. Matéria prima, ingredientes e embalagens",
    itens: [
      {
        id: "armazenamento_protecao",
        descricao: "As Matérias-primas, ingredientes e embalagens são armazenadas em local limpo e organizado de acordo com suas características de forma a garantir proteção contra contaminação."
      },
      {
        id: "produtos_reprovados",
        descricao: "Produtos reprovados com prazo de validade vencido ou para devolução aos fornecedores estão devidamente identificadas e armazenadas separadamente."
      },
      {
        id: "armazenamento_altura",
        descricao: "As matérias-primas, ingredientes e embalagens são armazenadas sobre paletes, estrados ou prateleiras com altura mínima de 30cm do piso e no mínimo 40cm de afastamento das paredes."
      },
      {
        id: "armazenamento_produto_final",
        descricao: "Armazenamento do produto final: produtos avariados, com prazo de validade vencido, devolvidos ou recolhidos do mercado devidamente identificados e armazenados em local separado."
      }
    ]
  },
  {
    titulo: "5. Preparação de Alimentos",
    itens: [
      {
        id: "higienizacao_maos",
        descricao: "Durante a preparação dos alimentos os manipuladores realizam a higienização das mãos?"
      },
      {
        id: "exposicao_alimentos",
        descricao: "Durante a preparação dos alimentos os alimentos ficam expostos ou fora da temperatura adequada?"
      },
      {
        id: "contaminacao_cruzada",
        descricao: "Durante a preparação dos alimentos são adotadas medidas a fim de minimizar o risco de contaminação cruzada, evitando contato direto ou indireto entre alimentos crus, semi-preparado e preparados."
      },
      {
        id: "exposicao_temperatura_ambiente",
        descricao: "As matérias-primas e ingredientes caracterizados como produtos perecíveis são expostas a temperatura ambiente somente pelo tempo mínimo necessário para a preparação do alimento."
      },
      {
        id: "lavatorios_producao",
        descricao: "Existe lavatórios na área de produção: com água corrente, dotados preferencialmente de torneira com acionamento automático e em número suficiente de modo a atender todas as áreas com sabonete líquido inodoro."
      },
      {
        id: "acondicionamento_ingredientes",
        descricao: "As matérias-primas e ingredientes que não são utilizados em sua totalidade são adequadamente acondicionados e identificados com, no mínimo, as seguintes informações: designação da produção"
      }
    ]
  },
  {
    titulo: "6. Transporte de Alimentos",
    itens: [
      {
        id: "veiculos_higienizados",
        descricao: "Os alimentos são transportados em veículos higienizados, com medidas que garantem a ausência de vetores e pragas urbanas e dotados de cobertura para proteção da carga"
      },
      {
        id: "contaminacao_cruzada_transporte",
        descricao: "Durante o transporte de alimentos são adotadas medidas a fim de minimizar o risco de contaminação cruzada, evitando contato direto ou indireto entre alimentos crus, semi-preparado, prontos para consumo"
      },
      {
        id: "caixas_isotermicas",
        descricao: "Caixas Isotérmicas ISOBOX, em bom estado de higienização e conservação."
      }
    ]
  },
  {
    titulo: "7. Coleta de Amostra",
    itens: [
      {
        id: "coleta_amostras",
        descricao: "São coletadas amostras de todas as preparações, são devidamente identificadas (nome do estabelecimento, nome do produto, data e horário da coleta e nome de quem a realizou)."
      },
      {
        id: "armazenamento_amostras",
        descricao: "As amostras são armazenadas por 72 horas"
      }
    ]
  },
  {
    titulo: "8. Equipamento de Proteção Individual e Uniforme",
    itens: [
      {
        id: "uso_epi",
        descricao: "Os manipuladores utilizam equipamentos de proteção individual quando necessário."
      },
      {
        id: "funcionarios_limpeza",
        descricao: "Os funcionários que realizam a limpeza são capacitados para a atividade e utilizam uniforme diferenciado e equipamento de proteção individual para tanto."
      },
      {
        id: "estado_epis",
        descricao: "EPI's, em bom estado de higienização."
      }
    ]
  },
  {
    titulo: "9. POP - Procedimentos Operacionais Padronizados",
    itens: [
      {
        id: "pop_higienizacao_produtos",
        descricao: "POP Higienização: Produtos regularizados pelo Ministério da Saúde, guardados em local identificado, separados de alimentos e embalagens. Atentar para instruções de uso (finalidade, diluições, uso de EPIs)."
      },
      {
        id: "pop_higienizacao_utensilios",
        descricao: "POP Higienização: Disponibilidade dos utensílios (escovas, esponjas etc.) de uso exclusivo para esta atividade e dos EPIs necessários (luvas, óculos, botas, máscaras, etc.)."
      },
      {
        id: "pop_higiene_uniforme",
        descricao: "POP Higiene e Saúde dos Manipuladores: Uniforme de trabalho de cor clara, limpos e em bom estado de conservação, exclusivo para área de produção."
      },
      {
        id: "pop_higiene_asseio",
        descricao: "POP Higiene e Saúde dos Manipuladores: Asseio corporal, mãos limpas, unhas curtas, sem esmalte, sem adornos, manipuladores barbeados e com os cabelos protegidos."
      },
      {
        id: "pop_higiene_cartazes",
        descricao: "POP Higiene e Saúde dos Manipuladores: Cartazes de orientação aos manipuladores sobre a correta lavagem das mãos e demais hábitos de higiene, afixados em locais apropriados."
      },
      {
        id: "pop_higiene_treinamento",
        descricao: "POP Higiene e Saúde dos Manipuladores: Certificado de participação em Treinamento para Manipulação de Alimentos (2 anos)."
      },
      {
        id: "pop_agua_limpeza",
        descricao: "POP de Controle da Potabilidade da Água: Registro de limpeza da caixa de água semestral."
      },
      {
        id: "pop_pragas_certificado",
        descricao: "POP de Controle Integrado de Pragas: Certificado de desinsetização e desratização emitido por empresa licenciada pela Vigilância em Saúde"
      },
      {
        id: "pop_manutencao_equipamentos",
        descricao: "POP Manutenção preventiva e calibração de equipamentos: planilhas de controle da manutenção preventiva dos equipamentos ou certificados quando realizados por empresas terceirizadas"
      }
    ]
  }
];