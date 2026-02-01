import pkg from '@yao-pkg/pkg'
import { isWindows } from '../src/utils.js'
import { unlinkSync } from 'fs'
import { rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'

const result = await rollup({
  input: process.argv[2] + '/index.js',
  output: {
    file: 'dist/out.cjs',
    format: 'cjs',
  },
  plugins: [json(), resolve(), commonjs()],
})
await result.write({
  format: 'cjs',
  file: 'dist/out.cjs',
})
await pkg.exec([
  'dist/out.cjs',
  '--target',
  'host',
  '--output',
  'dist/' + process.argv[2] + (isWindows() ? '.exe' : ''),
  '-d',
])
unlinkSync('dist/out.cjs')
