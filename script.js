document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const opened = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(opened));
      toggle.textContent = opened ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    }));
  }

  const filters = document.querySelectorAll('.filter');
  const items = document.querySelectorAll('.menu-item');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => filter.classList.remove('active'));
    button.classList.add('active');
    const category = button.dataset.filter;
    items.forEach(item => {
      item.classList.toggle('hidden', category !== 'all' && item.dataset.category !== category);
    });
  }));

  const form = document.getElementById('orderForm');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent('Miksweets order inquiry - ' + data.get('treat'));
    const body = encodeURIComponent(
      'Hello Miksweets!\n\n' +
      'Name: ' + data.get('name') + '\n' +
      'Reply email: ' + data.get('email') + '\n' +
      'Treat: ' + data.get('treat') + '\n' +
      'Quantity: ' + data.get('quantity') + '\n' +
      'Message: ' + data.get('message') + '\n\n' +
      'Please confirm availability and pickup/delivery details.\n\nThank you!'
    );
    const hint = document.getElementById('formHint');
    if (hint) hint.textContent = 'Your email app should open with the order details filled in. Review the message and press Send to place your order.';
    window.location.href = 'mailto:Miksweets@gmail.com?subject=' + subject + '&body=' + body;
  });
});