PACKAGE_NAME="fulgence";
PACKAGE_REL_PATH="../..";
WHITELISTED_MODULE="a";

package_expected_path=$(realpath "$(pwd)/${PACKAGE_REL_PATH}")
package_installed_path=$(realpath node_modules/${PACKAGE_NAME});
if [[ "$package_installed_path" != "$package_expected_path" && "$CHUNK_NAME" == "$WHITELISTED_MODULE" ]]; then
    echo "Fixing ${PACKAGE_NAME} path in container.";
    rm -r node_modules/${PACKAGE_NAME};
    npm install --save ${package_expected_path};
else
  sleep 1;
fi
