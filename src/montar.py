# -*- coding: utf-8 -*-
# monta index.html a partir de src/. Uso: python src/montar.py
import io, os
os.chdir(os.path.join(os.path.dirname(__file__), '..'))
rd = lambda p: io.open(p, encoding='utf-8').read()
e = rd('src/E-resto.js').replace('/*FINMARK*/\n', rd('src/H-fin.js') + rd('src/J-guia.js') + rd('src/I-fin2.js') + '\n', 1)
s = ''.join([rd('src/A-head.html'), rd('src/B-body.html'), rd('src/C-core.js'), rd('src/D-hoje.js'), e])
io.open('index.html', 'w', encoding='utf-8', newline='\n').write(s)
print('index.html montado:', len(s), 'bytes')
