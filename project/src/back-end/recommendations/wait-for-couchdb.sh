#!/bin/bash -
#===============================================================================
#
#          FILE: wait-for-couchdb.sh
#
#         USAGE: ./wait-for-couchdb.sh
#
#   DESCRIPTION:
#
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Raziel Carvajal-Gomez (), raziel.carvajal@uclouvain.be
#  ORGANIZATION:
#       CREATED: 10/22/2019 00:12
#      REVISION:  ---
#===============================================================================

until curl --request PUT ${DB_URL_LOG} ; do
  echo "Logs DB wasn't created - sleeping"
  sleep 1
done
echo "Connected to Log DB"

source fill_db.sh ${DB_URL_LOG} dataset

echo "Apply a formatter for each view"
mkdir formatter_output
DEBUG=views* node func_to_string.js
if [[ ${?} != 0 ]]; then
  echo -e "ERROR: during the creation of views\nEND OF \{0}"
  exit 1
fi
echo -e "\tDONE"

cd formatter_output
echo "Creation of views for logs DB"
for view in `ls *.js`; do
  curl --request PUT "${DB_URL_LOG}/_design/queries" --upload-file ${view}
  if [[ ${?} != 0 ]]; then
    echo -e "ERROR: during the creation of view ${view}\nEND OF \{0}"
    exit 1
  fi
done
echo -e "\tDONE"

echo "END OF ${0}"
#wait for recommendation database to be up

echo "Wait (indefenitly) until the DB creation (name: ${DB_NAME})."
echo "The DB URL is: ${DB_URL}"
until curl --request PUT ${DB_URL} ; do
  echo -e "\t DB (${DB_NAME}) wasn't created - trying again later..."
  sleep 2
done
echo "DB (${DB_NAME}) was created!"

echo "Start recommendations service..."
npm start
