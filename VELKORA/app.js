/* All amounts stay in this browser; no analytics or calculation API. */
const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat('es-AR', {style:'currency',currency:'ARS',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
const formatInput = value => new Intl.NumberFormat('es-AR',{maximumFractionDigits:2}).format(value);
function parseAR(text){
  const cleaned = String(text).trim();
  if(!/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/.test(cleaned)) return NaN;
  return Number(cleaned.replaceAll('.','').replace(',','.'));
}
function compute({amount,rate,mode,iibbRate,baseType,customBase,tab}){
  const r=tab==='iibb'?0:rate/100;
  const net=mode==='included'?amount/(1+r):amount;
  const iva=net*r;
  const total=net+iva;
  const base=baseType==='custom'?customBase:baseType==='total'?total:net;
  const iibb=tab==='iva'?0:base*iibbRate/100;
  return {net,iva,total,iibb,base,remaining:net-iibb};
}
let tab='combined',result=null;
function current(){return {amount:parseAR($('amount').value),rate:Number($('iva-rate').value),mode:document.querySelector('[name=mode]:checked').value,iibbRate:parseAR($('iibb-rate').value),baseType:$('iibb-base').value,customBase:parseAR($('custom-base').value),tab};}
function update(){
  const v=current();
  $('custom-base-wrap').hidden=v.baseType!=='custom';
  $('iva-options').hidden=tab==='iibb';$('iibb-options').hidden=tab==='iva';
  $('iva-result-row').hidden=tab==='iibb';$('iibb-result-row').hidden=tab==='iva';
  $('iva-legend').hidden=tab==='iibb';$('iibb-legend').hidden=tab==='iva';
  let error='';
  if(!Number.isFinite(v.amount)||v.amount<0||v.amount>1e12) error='Ingresá un monto entre $0 y $1.000.000.000.000. Usá coma para los decimales.';
  else if(tab!=='iva'&&(!Number.isFinite(v.iibbRate)||v.iibbRate<0||v.iibbRate>100)) error='Ingresá una alícuota de IIBB entre 0 y 100, con coma para los decimales.';
  else if(tab!=='iva'&&v.baseType==='custom'&&(!Number.isFinite(v.customBase)||v.customBase<0||v.customBase>1e12)) error='Revisá la base personalizada: debe ser un monto entre $0 y $1.000.000.000.000.';
  $('amount-error').hidden=!error;$('amount-error').textContent=error;
  $('amount').setAttribute('aria-invalid',String(!Number.isFinite(v.amount)||v.amount>1e12));
  document.querySelector('.results').classList.toggle('invalid',!!error);
  ['copy','share','download'].forEach(id=>$(id).disabled=!!error);
  if(error){result=null;$('remaining').textContent='—';['net','iva','iibb','total'].forEach(id=>$(id).textContent='—');$('feedback').textContent='';return;}
  result=compute(v);
  for(const key of ['remaining','net','iva','iibb','total']) $(key).textContent=money(result[key]);
  $('iva-pct').textContent=formatInput(v.rate)+'%';$('iibb-pct').textContent=formatInput(v.iibbRate)+'%';
  $('result-desc').textContent=tab==='iva'?'Base de la operación, sin el IVA indicado.':tab==='iibb'?'Monto menos el IIBB estimado sobre la base elegida.':'Sin el IVA de esta venta y el IIBB estimado.';
  $('estimate-note').textContent=tab==='iibb'?'IIBB estimado sobre '+money(result.base)+'. No descuenta retenciones ni percepciones. No es tu ganancia ni una liquidación fiscal.':'El IVA mostrado es el de esta venta: no descuenta crédito fiscal. El remanente no es tu ganancia ni una liquidación de impuestos.';
  if(result.remaining<0) $('result-desc').textContent+=' La reserva supera el monto: revisá la base personalizada.';
  const denom=Math.max(result.total,result.iva+result.iibb,1);
  $('net-bar').style.width=(Math.max(result.remaining,0)/denom*100)+'%';
  $('iva-bar').style.width=(result.iva/denom*100)+'%';$('iibb-bar').style.width=(result.iibb/denom*100)+'%';
  $('feedback').textContent='';
}
function selectTab(next){tab=next;document.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===tab;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});$('calc-panel').setAttribute('aria-labelledby','tab-'+tab);update();}
document.querySelectorAll('[data-tab]').forEach(button=>{button.addEventListener('click',()=>selectTab(button.dataset.tab));button.addEventListener('keydown',e=>{const tabs=[...document.querySelectorAll('[data-tab]')];let i=tabs.indexOf(button);if(e.key==='ArrowRight')i=(i+1)%tabs.length;else if(e.key==='ArrowLeft')i=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else return;e.preventDefault();tabs[i].focus();selectTab(tabs[i].dataset.tab);});});
$('tax-form').addEventListener('submit',e=>e.preventDefault());
$('tax-form').addEventListener('input',update);$('tax-form').addEventListener('change',update);
document.querySelectorAll('[data-amount]').forEach(b=>b.addEventListener('click',()=>{$('amount').value=formatInput(Number(b.dataset.amount));update();}));
for(const id of ['amount','custom-base']) $(id).addEventListener('blur',()=>{const v=parseAR($(id).value);if(Number.isFinite(v))$(id).value=formatInput(v);});
$('reset').addEventListener('click',()=>{$('tax-form').reset();selectTab('combined');history.replaceState(null,'',location.pathname);$('feedback').textContent='Valores restablecidos.';});
function report(){const v=current();return ['VELKORA · Estimación de impuestos',`Cálculo: ${tab==='combined'?'IVA e IIBB':tab==='iva'?'Solo IVA':'Solo IIBB'}`,`Monto ingresado: ${money(v.amount)}`,`Base sin IVA: ${money(result.net)}`,tab!=='iibb'?`IVA (${formatInput(v.rate)}%): ${money(result.iva)}`:null,tab!=='iva'?`IIBB (${formatInput(v.iibbRate)}%) sobre ${money(result.base)}: ${money(result.iibb)}`:null,`Total operación: ${money(result.total)}`,`Remanente estimado: ${money(result.remaining)}`,'No es ganancia ni liquidación fiscal. No descuenta créditos fiscales, retenciones, percepciones ni costos.'].filter(Boolean).join('\n');}
async function copyText(text,message){try{await navigator.clipboard.writeText(text);$('feedback').textContent=message;}catch{$('feedback').textContent='No se pudo copiar automáticamente. Seleccioná el texto del resultado para copiarlo.';}}
$('copy').addEventListener('click',()=>result&&copyText(report(),'Resultado copiado.'));
$('share').addEventListener('click',()=>{if(!result)return;const v=current(),url=new URL(location.href);url.search='';url.hash=new URLSearchParams(Object.entries(v).map(([k,x])=>[k,String(x)])).toString();copyText(url.href,'Enlace copiado. Incluye el monto y las opciones de tu cálculo.');});
$('download').addEventListener('click',()=>{if(!result)return;const v=current();const rows=[['Concepto','Importe ARS'],['Monto ingresado',v.amount],['Base sin IVA',result.net],...(tab!=='iibb'?[['IVA ('+formatInput(v.rate)+'%)',result.iva]]:[]),...(tab!=='iva'?[['Base IIBB',result.base],['IIBB ('+formatInput(v.iibbRate)+'%)',result.iibb]]:[]),['Total operación',result.total],['Remanente estimado',result.remaining],['Alcance','Estimación de una operación. No es ganancia ni liquidación fiscal.']];const csv='﻿'+rows.map(row=>row.map(x=>'"'+String(typeof x==='number'?x.toFixed(2).replace('.',','):x).replaceAll('"','""')+'"').join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='estimacion-impuestos-velkora.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('feedback').textContent='Descarga preparada para Excel o Google Sheets.';});
try{const p=new URLSearchParams(location.hash.slice(1));if(p.has('amount')){for(const [key,id] of [['amount','amount'],['iibbRate','iibb-rate'],['customBase','custom-base']]){const val=Number(p.get(key));if(p.has(key)&&Number.isFinite(val))$(id).value=formatInput(val);}if(['21','10.5','27','0'].includes(p.get('rate')))$('iva-rate').value=p.get('rate');if(['net','total','custom'].includes(p.get('baseType')))$('iibb-base').value=p.get('baseType');if(['included','add'].includes(p.get('mode')))document.querySelector('[name=mode][value='+p.get('mode')+']').checked=true;if(['combined','iva','iibb'].includes(p.get('tab')))tab=p.get('tab');}}catch{}
selectTab(tab);
