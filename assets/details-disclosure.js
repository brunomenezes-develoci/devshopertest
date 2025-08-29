class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;
    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);


// A classe DetailsDisclosure continua a mesma, não precisa ser alterada.
class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.summary = this.querySelector('summary');
    this.timeout = null;

    // Desabilitamos o clique para que o JavaScript tenha controle total
    this.summary.addEventListener('click', (event) => {
      event.preventDefault();
    });

    // Adicionamos os eventos de mouse no container principal
    this.addEventListener('mouseenter', this.onMouseEnter.bind(this));
    this.content.addEventListener('mouseleave', this.onMouseLeave.bind(this));

    this.summary.addEventListener('mouseleave', () => {
      const menuRect = this.content.getBoundingClientRect(); // pega o retângulo do menu
      const y = event.clientY; // posição X do mouse ao sair
      // só fecha se o mouse estiver à esquerda ou à direita do menu
      if (y < menuRect.top || y > menuRect.bottom) {
        this.timeout = setTimeout(() => {
          this.close();
        }, 150);
      }
    });

  }

  // Ação ao entrar com o mouse: Abre o menu imediatamente e limpa o temporizador
  onMouseEnter() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    if (window.matchMedia('(min-width: 990px)').matches) {
      this.mainDetailsToggle.setAttribute('open', '');
    }
  }

  // Ação ao sair com o mouse: Inicia um temporizador para fechar o menu
  onMouseLeave() {
    if (window.matchMedia('(min-width: 990px)').matches) {
      this.timeout = setTimeout(() => {
        this.close();
      }, 150); // Atraso em milissegundos. Ajuste se precisar.
    }
  }

  // Ação ao clicar (para acessibilidade em mobile)
  onToggle() {
    // ... essa lógica permanece igual ...
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;
    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}


customElements.define('header-menu', HeaderMenu);