# Note: This script must be executed inside docker
# if you previously did "npm install" outside Docker, on Docker host.
PACKAGE_NAME="@rollup/rollup-linux-x64-musl";
PACKAGE_PATH="node_modules/${PACKAGE_NAME}";

if [ ! -d "${PACKAGE_PATH}" ]; then
  echo "Reinstalling node packages to have ${PACKAGE_NAME}";
  # note: do not "npm uninstall", this alters the package.json
  # and make tests infinitely looping.
  npm install # install optionalDependencies
fi;
