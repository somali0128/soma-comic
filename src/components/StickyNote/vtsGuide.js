/**
 * 「怎么放进 VTS」说明 —— 页面底部那一段就是从这里渲染的。
 *
 * 校对时直接改这里的文字即可，不用动页面代码：
 * - steps：按顺序显示的步骤，title 是步骤标题，body 是说明（可以写多句）。
 * - code：可选，会以等宽字体单独显示一行（比如文件夹路径）。
 * - tips：步骤下面的小提示，没有就留空数组。
 */

export const VTS_GUIDE = {
  title: '怎么放进 VTS',
  intro: '导出的 PNG 是透明背景，可以直接当作 VTube Studio 的道具使用。',
  steps: [
    {
      title: '导出图片',
      body: '在上面点「下载 PNG」。道具一般用 768 或 1024 就够清楚。如果之后要更新文字，建议在「文件名」里填一个固定的英文名字。',
    },
    {
      title: '放进道具文件夹',
      body: '把 PNG 放进 VTube Studio 安装目录下的这个文件夹：',
      code: 'VTube Studio_Data/StreamingAssets/Items',
    },
    {
      title: '在 VTS 里加载道具',
      body: '打开 VTS 的道具菜单，在道具列表里找到这张图片并加载，它会出现在画面上。',
    },
    {
      title: '钉在头发上',
      body: '把道具钉（Pin）在带物理效果的头发 ArtMesh 上，比如呆毛或刘海。这样头动的时候，纸条也会跟着晃。',
    },
    {
      title: '更新文字',
      body: '改完文字后，用同一个文件名重新导出，覆盖 Items 文件夹里的旧文件，然后在 VTS 里重新加载这个道具。',
    },
  ],
  tips: [
    'Steam 版可以在 Steam 库里右键 VTube Studio →「管理」→「浏览本地文件」，找到安装目录。',
    '文件名只用英文、数字和短横线，避免中文文件名在 VTS 里出问题。',
  ],
};
