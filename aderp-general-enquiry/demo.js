
// Simple validation & behavior for the demo mock
const requiredFields = [
  {name:'contact_number', el: document.getElementById('contact_number')},
  {name:'offering',       el: document.getElementById('offering')},
  {name:'request_title',  el: document.getElementById('request_title')},
  {name:'request_description', el: document.getElementById('request_description')},
];

function setErrorFor(el, hasError){
  const field = el.closest('.sn-field');
  if(!field) return;
  field.classList.toggle('error', hasError);
}

function validate(){
  let ok = true;
  requiredFields.forEach(({el})=>{
    const empty = !el.value || !String(el.value).trim();
    setErrorFor(el, empty);
    if(empty) ok = false;
  });
  return ok;
}

document.getElementById('submitBtn').addEventListener('click', (e)=>{
  e.preventDefault();
  if(validate()){
    alert('All validations passed. (Demo only)');
  }else{
    const firstErr = document.querySelector('.sn-field.error .sn-input, .sn-field.error .sn-select, .sn-field.error .sn-textarea');
    if(firstErr) firstErr.focus();
  }
});
