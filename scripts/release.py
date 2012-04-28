#!/usr/bin/python
# encoding: utf-8

import argparse
from contextlib import closing
import glob
import json
import os
from os import path
from subprocess import Popen, PIPE, check_call, check_output
import tempfile
from urllib import urlencode
from urllib2 import urlopen

CLOSURE_URL = 'http://closure-compiler.appspot.com/compile'

def out(type, file):
	print '{:>8s} {}'.format(type, file)

parser = argparse.ArgumentParser()
parser.add_argument('tag', nargs='?', default=None)
args = parser.parse_args()

# Only tags can be "released"
# this should avoid mistakes during release
if args.tag is None:
	tag = check_output(['git', 'tag']).strip()
else:
	tag = args.tag

# git doesn't support tags starting with numbers, so we add a "v" in front
# of the version number, copying Linux. However, when we generate the final
# archive we want it to be uselect-idownload-X.Y.zip so we have to strip the
# initial "v"
reldir = 'uselect-idownload-{}'.format(tag[1:])
zipfile = reldir + '.zip'

tmpdir = tempfile.mkdtemp()
p0 = Popen(['git', 'archive', '--format=tar',
            '--prefix={}/'.format(reldir), tag],
           stdout=PIPE)
p1 = Popen(['tar', '-C', tmpdir, '-x'], stdin=p0.stdout)

ret = p1.wait()

rundir = os.getcwd()


with open('release.json', 'r') as f:
	conf = json.load(f)

os.chdir(path.join(tmpdir, reldir))

jscomp = path.join(rundir, 'tools', 'closure-compiler.jar')
for pat in conf['js']:
	for jsfile in glob.iglob(pat):
		out('JS', jsfile)
		outfile = jsfile + '.o'
		check_call([
			'java', '-jar', jscomp,
			'--compilation_level', 'SIMPLE_OPTIMIZATIONS',
			'--js_output_file', outfile,
			jsfile
		])
		os.rename(outfile, jsfile)

csscomp = path.join(rundir, 'tools', 'closure-stylesheets.jar')
for pat in conf['css']:
	for cssfile in glob.iglob(pat):
		out('CSS', cssfile)
		outfile = cssfile + '.o'
		check_call([
			'java', '-jar', csscomp,
			'-o', outfile,
			cssfile
		])
		os.rename(outfile, cssfile)

for pat in conf['exclude']:
	for rmfile in glob.iglob(pat):
		if rmfile.endswith('/'):
			out('RMDIR', rmfile)
			check_call(['rm', '-rf', rmfile])
		else:
			out('RM', rmfile)
			os.unlink(rmfile)

os.chdir(tmpdir)

out('ZIP', zipfile)
check_call(['zip', '-qr', zipfile, reldir])
os.rename(zipfile, path.join(rundir, zipfile))
