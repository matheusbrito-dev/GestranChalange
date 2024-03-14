import { Component, OnInit } from '@angular/core';

class Publicacao {
  constructor(
    public readonly titulo: string,
    public readonly autor: string,
    public readonly anoPublicacao: number
  ) {}

  descricao(): string {
    return `Título: ${this.titulo}, Autor: ${this.autor}, Ano de Publicação: ${this.anoPublicacao}`;
  }
}

class Livro extends Publicacao {
  constructor(
    titulo: string,
    autor: string,
    anoPublicacao: number,
    public readonly ISBN: string
  ) {
    super(titulo, autor, anoPublicacao);
  }

  descricao(): string {
    return `${super.descricao()}, ISBN: ${this.ISBN}`;
  }
}

class Periodico extends Publicacao {
  constructor(
    titulo: string,
    autor: string,
    anoPublicacao: number,
    public readonly ISSN: string
  ) {
    super(titulo, autor, anoPublicacao);
  }

  descricao(): string {
    return `${super.descricao()}, ISSN: ${this.ISSN}`;
  }
}

@Component({
  selector: 'app-a1.5-classe',
  templateUrl: './a1.5-classe.component.html',
  styleUrls: ['./a1.5-classe.component.scss'],
})
export class A15ClasseComponent implements OnInit {
  livroExemplo: Livro;
  periodicoExemplo: Periodico;

  constructor() {
    this.livroExemplo = new Livro(
      'Exemplo de Livro',
      'Autor Exemplo',
      2020,
      'ISBN-EXEMPLO'
    );
    this.periodicoExemplo = new Periodico(
      'Exemplo de Periódico',
      'Editor Exemplo',
      2021,
      'ISSN-EXEMPLO'
    );
  }

  ngOnInit(): void {
    console.log(this.livroExemplo.descricao());
    console.log(this.periodicoExemplo.descricao());
    console.log(this.periodicoExemplo.descricao());
  }
}
