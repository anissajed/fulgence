import jwt from "jsonwebtoken";

const {SECRET} = process.env;
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const PROVIDER = "fulgence";

const generateToken = ({sub}) => jwt.sign({
  iat: new Date().getTime(),
  exp: new Date().setDate(new Date().getDate() + ONE_DAY_IN_MS),
  provider: PROVIDER,
  sub,
},
SECRET,
);

export const generateJWT = async ({sub}) => {
  if (!SECRET) return null;

  const token = await generateToken({sub});
  return token;
};

const verifyToken = (token, secret) => new Promise((res, rej) => {
  jwt.verify(token, secret, function(err, decoded) {
    if (err) return rej(err);
    return res(decoded);
  });
});


export const verifyJWT = async (token) => {
  if (!SECRET) return null;

  const decoded = await verifyToken(token, SECRET);

  return decoded;
}
