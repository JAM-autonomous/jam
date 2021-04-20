#! /bin/sh
rm -f package.json
echo "Want to make file with code signing? [yes|no]"
read codesign

if [ "$codesign" == "yes" ]
then
	echo "Making file with code signing..."
	cp -f package.codesign.json package.json
else 
	echo "Making file without code signing..."
	cp -f package.no-codesign.json package.json
fi

yarn
yarn make