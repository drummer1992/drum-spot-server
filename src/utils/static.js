export const toStaticPath = url => {
  return url.replace(process.env.STATIC_URL, process.env.PATH_TO_STATIC)
}

export const toStaticURL = path => {
  return path.replace(process.env.PATH_TO_STATIC, process.env.STATIC_URL)
} 