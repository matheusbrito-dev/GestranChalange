import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface Pessoa {
  nome: string;
  email: string;
  senha: string;
  cep: string;
  logradouro: string;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
})
export class FormularioComponent implements OnInit {
  form = new FormGroup({
    nome: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required]),
    cep: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
    logradouro: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
  });

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<FormularioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Pessoa
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
      if (this.data.cep && this.data.cep.length === 8) {
        this.buscarCep(this.data.cep);
      }
    }

    this.form.get('cep')!.valueChanges.subscribe((cep) => {
      if (cep.length === 8) {
        this.buscarCep(cep);
      }
    });
  }

  buscarCep(cep: string) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    this.http.get(url).subscribe(
      (dados: any) => {
        if (!dados.erro) {
          this.form.patchValue({
            logradouro: dados.logradouro,
          });
          this.form.get('logradouro')!.enable();
        } else {
          alert('CEP não encontrado.');
          this.form.patchValue({
            logradouro: '',
          });
        }
      },
      (error) => {
        console.error('Erro ao buscar CEP:', error);
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      alert('Formulário inválido');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
