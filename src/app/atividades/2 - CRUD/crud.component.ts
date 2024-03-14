import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { FormularioComponent, Pessoa } from './formulario/formulario.component';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss'],
})
export class CrudComponent implements OnInit {
  filtro = new FormControl();
  displayedColumns: string[] = [
    'actions',
    'nome',
    'email',
    'senha',
    'cep',
    'logradouro',
  ];
  dataSource: Pessoa[] = [
    {
      nome: 'Teste1',
      email: 'teste@email1.com',
      senha: '1234',
      cep: '80250104',
      logradouro: 'Rua teste',
    },
  ];
  filteredDataSource: Pessoa[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private dialog: MatDialog) {}

  filtrar(arg: string) {
    console.log('filtrando...'); //não remover essa linha
  }

  ngOnInit(): void {
    this.filtro.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value) => {
        this.applyFilter(value);
      });
    this.filteredDataSource = this.dataSource;
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  applyFilter(filterValue: string): void {
    if (!filterValue) {
      this.filteredDataSource = this.dataSource;
    } else {
      this.filteredDataSource = this.dataSource.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }
  }

  adicionar(): void {
    const dialogRef = this.dialog.open(FormularioComponent, { width: '250px' });
    dialogRef.afterClosed().subscribe((result: Pessoa) => {
      if (result) {
        this.dataSource = [...this.dataSource, result];
        this.applyFilter(this.filtro.value);
      }
    });
  }

  editar(pessoa: Pessoa): void {
    const dialogRef = this.dialog.open(FormularioComponent, {
      width: '250px',
      data: { ...pessoa },
    });

    dialogRef.afterClosed().subscribe((result: Pessoa) => {
      if (result) {
        const index = this.dataSource.findIndex(
          (p) => p.email === pessoa.email
        );
        if (index !== -1) {
          this.dataSource[index] = result;
          this.dataSource = [...this.dataSource];
          this.applyFilter(this.filtro.value);
        }
      }
    });
  }

  remover(pessoa: Pessoa): void {
    if (confirm(`Deseja remover a pessoa ${pessoa.nome}?`)) {
      this.dataSource = this.dataSource.filter((p) => p.email !== pessoa.email);
      this.applyFilter(this.filtro.value);
      alert('Removido com sucesso!');
    }
  }
}
