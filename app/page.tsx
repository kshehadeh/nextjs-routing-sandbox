
const HEIGHT="350px"

const PAGE = [
  "/pages-router/non-dynamic/client",
  "/pages-router/non-dynamic/static",
  "/pages-router/dynamic/1/client",
  "/pages-router/dynamic/1/static"
]

const APP = [
  "/app-router/dynamic/1/server",
  "/app-router/non-dynamic/server",
]

export default function NavigationHome () {
  return (
    <>
      <h2>Pages Router</h2>      
      <div className="grid grid-cols-4 gap-4">
          {PAGE.map((page) => (<div key={page}><iframe src={page} height={HEIGHT} className="bg-white"/></div>))}      
          </div>
      <h2>App Router</h2>
      <div className="grid grid-cols-4 gap-4">
        {APP.map((page) => (<div key={page}><iframe src={page} height={HEIGHT} className="bg-white"/></div>))}      
        </div>
    </>
  )
}