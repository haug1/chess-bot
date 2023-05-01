# first transpile with `ncc`
# then compile with `pkg`
# creates a linux binary at path ./dist/stockfish-<project-name>

PROJECT=$1
ncc build $PROJECT/index.js -o $PROJECT/dist/ && \
pkg $PROJECT/dist/index.js -t node16-linux -o dist/stockfish-$PROJECT && \
rm -rf $PROJECT/dist
