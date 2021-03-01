# Gerador de configurações de aglofloresta para o Mapeo

Esse é um teste de conceito para ver se o [Mapeo](http://mapeo.world/) funciona bem para marcar espécies em uma agrofloresta.

## Como usar

### Instalando Mapeo

Primeiro precisa instalar o Mapeo em um Android ou computador.

Para versão mobile pode-se instalar pelo [Play Store](https://play.google.com/store/apps/details?id=com.mapeo) ou baixar do [Github](https://github.com/digidem/mapeo-mobile/releases).

Para versão de computador baixe o instalador para sua plataforma no [Github](https://github.com/digidem/mapeo-desktop/releases).

### Adicionando configurações

A forma mais fácil é usar um arquivo de configuração que já foi gerado. Você pode baixar a última versão [aqui]().

Depois no aplicativo do Mapeo use a opção de "Importar configurações" para carregar o arquivo.

### Gerando configurações

Precisa ter NodeJS instalado e uma chave do [The Noun Project](https://thenounproject.com/developers/).

Modifique o arquivo `example.csv` se precisar e renome o arquivo `example.env` para `.env` adicionando ao menos as chaves do The Noun Project. Instale as bibliotecas com `npm install` e rode o programa: `node bin/prepareFiles.js example.csv`. Isso vai criar os presets do Mapeo e baixar ícones correspondentes as entradas na tabela de éspecies. Entre na pasta pre-icons e vai haver uma pasta para cada espécie. Selecione o melhor ícone para cada espécie e delete os outros. Caso alguma espécie não tenha baixado ícones, você pode busca-lo e adicionar a pasta manualmente (formato svg).

Depois de selecionado os ícones rode `node bin/updateIcons.js`. Isso vai preparar os ícones selecionados para o formato correto do Mapeo.

Finalmente rode `npm run build` para criar o arquivo `.mapeosettings` na pasta `build` que pode ser importado no Mapeo.

