## Testes

Para testar mude o env `APP_COPA_FAKE` para true, e execute o comando abaixo. Serão gerados dados fake.

```
make drop-database-seed
```
Para remover os dados fake mude o env `APP_COPA_FAKE` para false e exceute o comando novamente.


## No dia da Copa
Certifique-se que os envs `APP_COPA_FAKE`  e `APP_DELETEAR_RESPOSTAS` estão false.

* Cadastrar auxiliares
* Auxiliares cadastram particiapntes, na ordem que estão sentados, começando da cadeira da frente


Faça algumas perguntas de teste para saber se todos entenderam como vai funcionar.
Em seguida mude o env `APP_DELETEAR_RESPOSTAS` para true e execute o comando abaixo
```
make deletar-respostas
```
Apos executar o comando. mude o env `APP_DELETEAR_RESPOSTAS` para false.
