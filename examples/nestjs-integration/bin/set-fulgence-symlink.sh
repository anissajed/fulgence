PACKAGE_NAME="fulgence";
PACKAGE_REL_PATH="../..";
WD="$(pwd)";

package_installed_path=$(realpath node_modules/${PACKAGE_NAME});

if [[ ! -d "$package_installed_path" ]]; then
    echo "Installing local package ${PACKAGE_NAME} path in container.";
    cd $PACKAGE_REL_PATH; npm link;
    cd $WD; npm link $PACKAGE_REL_PATH;
fi
