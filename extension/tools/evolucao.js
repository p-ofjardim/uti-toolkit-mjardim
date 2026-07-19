/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */
// Função para limpar o formulário
        function limparFormulario() {
            document.querySelectorAll('input, select, textarea').forEach(el => {
                if (el.id !== 'box' && el.id !== 'data' && el.id !== 'sexo') {
                    el.value = '';
                }
            });
            document.getElementById('resultado').value = '';
        }
        
        // Função para preencher estabilidade clínica
		function preencherEstabilidade() {
			const fieldsToClear = [
				'nora', 'vaso', 'dobuta', 'tridil', 'nipride',
				'ventilac', 'ventilac-valor', 'vm', 'adapt',
				'neuro', 'rass', 'sedacao',
				'atb', 'febre', 'infecto',
				'diurese', 'diuretico', 'bh', 'esc-renal',
				'hemato', 'hemoterapia',
				'glicemias', 'dhes', 'bic',
				'dieta', 'dieta-valor', 'disf-tgi', 'evacuac',
				'cvc', 'cdl', 'pia', 'svd', 'les-pele', 'profilax'
			];

			// Limpa campos (só se existirem)
			fieldsToClear.forEach(id => {
				const el = document.getElementById(id);
				if (el) el.value = '';
			});

			// Preenche com valores de estabilidade (só se existirem)
			const preenchimentos = {
				'ventilac': 'Estabilidade em ar ambiente',
				'neuro': 'Estável',
				'rass': '',
				'sedacao': 'Sem sedação',
				'atb': 'Sem antibiótico',
				'febre': 'Afebril',
				'infecto': 'Sem critérios infecciosos',
				'diurese': 'Diurese satisfatória',
				'diuretico': 'Sem diurético',
				'bh': 'Neutro',
				'esc-renal': 'Função renal preservada',
				'hemato': 'Estável',
				'hemoterapia': 'Sem hemoterapia',
				'glicemias': 'Normoglicêmico',
				'dhes': 'Sem DHEs',
				'bic': 'Sem DABs',
				'dieta': 'Via oral',
				'disf-tgi': 'Sem disfunção do TGI',
				'evacuac': 'Evacuações presentes',
				'cvc': 'Sem CVC',
				'cdl': 'Sem CDL',
				'pia': 'Sem PIA',
				'svd': 'Sem SVD',
				'les-pele': 'Sem lesões de pele',
				'profilax': 'Sem profilaxias farmacológicas'
			};

			Object.entries(preenchimentos).forEach(([id, value]) => {
				const el = document.getElementById(id);
				if (el) el.value = value;
			});

			// Gera a evolução automaticamente após preencher
			gerarEvolucao();
		}
        
        // Função para copiar o resultado
        function copyResult() {
            const text = document.getElementById('resultado').value;
            if (!text || text.trim() === '') {
                alert('Nenhum texto para copiar');
                return;
            }
            navigator.clipboard.writeText(text).then(() => {
                alert('Texto copiado para a área de transferência!');
            }).catch(err => {
                alert('Erro ao copiar: ' + err);
            });
        }
        
        // Função principal para gerar a evolução
        function gerarEvolucao() {
            const box = document.getElementById('box').value;
            const data = document.getElementById('data').value;
            const sexo = document.getElementById('sexo').value;
            
            const linhas = [];
            
            // 1. HEMODINÂMICA
            const hemo = processarHemodinamica();
            if (hemo) linhas.push(hemo);
            
            // 2. VENTILAÇÃO
            const vent = processarVentilacao();
            if (vent) linhas.push(vent);
            
            // 3. NEUROLÓGICO + SEDAÇÃO
            const neuro = processarNeuro();
            if (neuro) linhas.push(neuro);
            
            // 4. INFECÇÃO (ATB + Febre + Infecção)
            const infecto = processarInfecto();
            if (infecto) linhas.push(infecto);
            
            // 5. RENAL (Diurese + Diurético + BH + Esc. Renal)
            const renal = processarRenal();
            if (renal) linhas.push(renal);
            
            // 6. HEMATOLÓGICO
            const hematologico = processarHematologico();
			if (hematologico) linhas.push(hematologico);

			// 7. METABÓLICO (Glicemias + DHEs + Bic)
			const metabolico = processarMetabolico();
			if (metabolico) linhas.push(metabolico);
            
            // 8. NUTRIÇÃO + ELIMINAÇÃO
            const nutricao = processarNutricao();
            if (nutricao) linhas.push(nutricao);

			// 9. LESÕES DE PELE
			const lesoesPele = processarLesoesPele();
			if (lesoesPele) linhas.push(lesoesPele);
            
            // 10. INVASÕES
			const invasoes = processarInvasoes();
			if (invasoes) linhas.push(invasoes);

			// 11. PROFILAXIA
			const profilaxia = processarProfilaxia();
			if (profilaxia) linhas.push(profilaxia);
            
            // Monta o texto final
            let textoFinal = `# Box ${box}\n\n`;
            textoFinal += linhas.join('\n\n');
            
            // Ajusta gênero
            textoFinal = ajustarGenero(textoFinal, sexo);
            
            document.getElementById('resultado').value = textoFinal;
        }
        
        // Atualiza as opções do select Diurese conforme o sexo selecionado
        function atualizarOpcoesDiurese() {
            const isFem = document.getElementById('sexo').value === 'F';
            const select = document.getElementById('diurese');
            const pares = [
                ['Oligúrico', 'Oligúrica'],
                ['Anúrico',   'Anúrica'  ]
            ];
            const currentVal = select.value;
            pares.forEach(([masc, fem]) => {
                const opt = Array.from(select.options).find(o => o.value === masc || o.value === fem);
                if (!opt) return;
                const novo = isFem ? fem : masc;
                opt.value = novo;
                opt.text  = novo;
                if (currentVal === masc || currentVal === fem) select.value = novo;
            });
        }

        // Função para ajustar gênero no texto gerado
        function ajustarGenero(texto, sexo) {
            if (sexo === 'F') {
                texto = texto.replace(/adaptado/gi,      'adaptada');
                texto = texto.replace(/oligúrico/gi,     'oligúrica');
                texto = texto.replace(/anúrico/gi,       'anúrica');
                texto = texto.replace(/normoglicêmico/gi,'normoglicêmica');
                texto = texto.replace(/disglicêmico/gi,  'disglicêmica');
                texto = texto.replace(/hipoglicêmico/gi, 'hipoglicêmica');
                texto = texto.replace(/hipotérmico/gi,   'hipotérmica');
            }
            return texto;
        }
        
        // Processadores por seção
        function processarHemodinamica() {
            const nora = document.getElementById('nora').value;
            const vaso = document.getElementById('vaso').value;
            const dobuta = document.getElementById('dobuta').value;
            const tridil = document.getElementById('tridil').value;
            const nipride = document.getElementById('nipride').value;
            
            // Se todos vazios ou zero
            if (!nora && !vaso && !dobuta && !tridil && !nipride) {
                return 'Estabilidade hemodinâmica.';
            }
            
            // Se algum tem valor
            const drogas = [];
            if (nora) drogas.push(`Noradrenalina a ${nora} mL/h`);
            if (vaso) drogas.push(`Vasopressina a ${vaso} U/min`);
            if (dobuta) drogas.push(`Dobutamina a ${dobuta} mcg/kg/min`);
            if (tridil) drogas.push(`Nitroglicerina a ${tridil} mcg/min`);
            if (nipride) drogas.push(`Nitroprussiato a ${nipride} mcg/kg/min`);
            
            return `Instabilidade hemodinâmica, em uso de ${drogas.join(', ')}.`;
        }
        
        function processarVentilacao() {
            const ventilac = document.getElementById('ventilac').value;
            const ventilacValor = document.getElementById('ventilac-valor').value;
            const vm = document.getElementById('vm').value;
            const adapt = document.getElementById('adapt').value;
            
            if (!ventilac) return '';
            
            let texto = '';
            
            switch(ventilac) {
                case 'Estabilidade em ar ambiente':
                    texto = 'Estabilidade ventilatória';
                    break;
                case 'Estabilidade em oxigenoterapia':
                    texto = 'Estabilidade ventilatória, em oxigenoterapia de baixo fluxo';
                    break;
                case 'Traqueostomia com oxigenoterapia':
                    texto = 'Estabilidade ventilatória, em oxigenoterapia pela traqueostomia';
                    break;
                case 'Traqueostomia em ar ambiente':
                    texto = 'Estabilidade ventilatória, traqueostomia em ar ambiente';
                    break;
                case 'Instabilidade':
                    texto = 'Instabilidade ventilatória';
                    break;
                case 'Masc. Alto Fluxo':
                    texto = `Instabilidade ventilatória, em uso de máscara de alto fluxo a ${ventilacValor || '???'} L/min`;
                    break;
                case 'Masc. Venturi':
                    texto = `Instabilidade ventilatória, em uso de máscara de Venturi a ${ventilacValor || '???'}%`;
                    break;
                default:
                    return '';
            }
            
            // Adiciona VM e adaptação se preenchidos
            if (vm) {
                const adaptText = adapt ? `, ${adapt.toLowerCase()}` : '';
                texto += ` em ${vm}${adaptText}`;
            }
            
            return texto + '.';
        }
        
        // neuro:
		function processarNeuro() {
			const neuro = document.getElementById('neuro').value;
			const rass = document.getElementById('rass').value;
			const sedacao = document.getElementById('sedacao').value;

			if (!neuro) return '';

			let texto = neuro === 'Estável' ? 'Estabilidade neurológica' : 'Instabilidade neurológica';

			if (rass) {
				texto += `, RASS ${rass}`;
			}

			if (sedacao) {
				texto += `; ${sedacao.toLowerCase()}`;
			}

			return texto + '.';
		}
        
        function processarInfecto() {
            const atb = document.getElementById('atb').value;
            const febre = document.getElementById('febre').value;
            const infecto = document.getElementById('infecto').value;
            
            const partes = [];
            if (atb) partes.push(atb);
            if (febre) partes.push(febre.toLowerCase());
            if (infecto) partes.push(infecto.toLowerCase());
            
            if (partes.length === 0) return '';
            			            
            return partes.join(', ') + '.';			
        }
        
        function processarRenal() {
            const diurese = document.getElementById('diurese').value;
            const diuretico = document.getElementById('diuretico').value;
            const bh = document.getElementById('bh').value;
            const escRenal = document.getElementById('esc-renal').value;
            
            const partes = [];
            if (diurese) partes.push(diurese);
            if (diuretico) partes.push(diuretico.toLowerCase());
            if (bh) partes.push(`balanço hídrico ${bh.toLowerCase()}`);
            if (escRenal) partes.push(escRenal.toLowerCase());
            
            if (partes.length === 0) return '';
            
            // Formata com ponto e vírgula
            return partes.join('; ') + '.';
        }
        
        // hematologico:
		function processarHematologico() {
			const hemato = document.getElementById('hemato').value;
			const hemoterapia = document.getElementById('hemoterapia').value;

			if (!hemato) return '';

			let texto = hemato === 'Estável' ? 'Estabilidade hematológica' : 'Instabilidade hematológica';

			if (hemoterapia && hemoterapia !== 'Sem hemoterapia') {
				texto += `, ${hemoterapia.toLowerCase()}`;
			}

			return texto.charAt(0).toUpperCase() + texto.slice(1) + '.';
		}
		// metabolico
		function processarMetabolico() {
			const glicemias = document.getElementById('glicemias').value;
			const dhes = document.getElementById('dhes').value;
			const bic = document.getElementById('bic').value;

			// Valores considerados "normais"
			const glicemiasNormal = glicemias === 'Normoglicêmico' || !glicemias;
			const dhesNormal = dhes === 'Sem DHEs' || !dhes;
			const bicNormal = bic === 'Sem DABs' || !bic;

			// Se todos estiverem normais
			if (glicemiasNormal && dhesNormal && bicNormal) {
				return 'Estabilidade metabólica.';
			}

			// Caso contrário, lista apenas os não normais
			const partes = [];
			if (glicemias && !glicemiasNormal) partes.push(glicemias.toLowerCase());
			if (dhes && !dhesNormal) partes.push(dhes);
			if (bic && !bicNormal) partes.push(bic.toLowerCase());

			if (partes.length === 0) return '';

			return 'Instabilidade metabólica; ' + partes.join('; ') + '.';
		}
        
		// nutricao
		function processarNutricao() {
			const dieta = document.getElementById('dieta').value;
			const dietaValor = document.getElementById('dieta-valor').value;
			const disfTgi = document.getElementById('disf-tgi').value;
			const evacuac = document.getElementById('evacuac').value;

			const partes = [];
			if (dieta) {
				if (dieta === 'Dieta enteral' && dietaValor) {
					partes.push(`Tolerando dieta enteral a ${dietaValor}`);
				} else if (dieta === 'NPT') {
					partes.push(`Tolerando ${dieta} a ${dietaValor || '???'} mL/h`);
				} else if (dieta === 'NPP') {
					partes.push(`Tolerando ${dieta} a ${dietaValor || '???'} mL/h`);
				} else if (dieta === 'Via oral') {
					partes.push('Tolerando dieta via oral');
				} else if (dieta) {
					partes.push(dieta.charAt(0).toUpperCase() + dieta.slice(1));
				}
			}
			if (disfTgi && disfTgi !== 'Sem disfunção do TGI') {
				partes.push(disfTgi.toLowerCase());
			}
			if (evacuac) {
				partes.push(evacuac.toLowerCase());
			}

			if (partes.length === 0) return '';

			return partes.join('; ') + '.';
		}
        
		// Função para lesões de pele
		function processarLesoesPele() {
			const lesPele = document.getElementById('les-pele').value;
			if (!lesPele) return '';
			return lesPele + '.';
		}
		
        function processarInvasoes() {
			const cvc = document.getElementById('cvc').value;
			const cdl = document.getElementById('cdl').value;
			const pia = document.getElementById('pia').value;
			const svd = document.getElementById('svd').value;

			const invasoes = [];
			if (cvc && cvc !== 'Sem CVC') invasoes.push(`CVC em ${cvc}`);
			if (cdl && cdl !== 'Sem CDL') invasoes.push(`CDL em ${cdl}`);
			if (pia && pia !== 'Sem PIA') invasoes.push(`PIA em ${pia}`);
			if (svd === 'Com SVD') invasoes.push('em uso de SVD');

			if (invasoes.length === 0) {
				return 'Sem invasões.';
			}

			return invasoes.join('; ') + '.';
		}

		// Função para profilaxia
		function processarProfilaxia() {
			const profilax = document.getElementById('profilax').value;
			if (!profilax) return '';
			return profilax + '.';
		}
        
        // Preencher data atual por padrão
        window.onload = function() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('data').value = today;
        };/**
 * Copyright (c) 2026 MJardim Serviços Médicos LTDA
 * Licensed under the MIT License (see LICENSE for details).
 */
// ── Firefox MV2 event delegation (replaces inline onclick) ─────────────────
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-fn]').forEach(function (el) {
    var fn  = el.getAttribute('data-fn');
    var arg = el.getAttribute('data-arg');
    el.addEventListener('click', function (e) {
      if (typeof window[fn] === 'function') {
        arg !== null ? window[fn](e, arg) : window[fn]();
      }
    });
  });
});
