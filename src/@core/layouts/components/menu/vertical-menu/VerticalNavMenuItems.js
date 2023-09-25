// ** Vertical Menu Components
import VerticalNavMenuLink from "./VerticalNavMenuLink"
import VerticalNavMenuGroup from "./VerticalNavMenuGroup"
import VerticalNavMenuSectionHeader from "./VerticalNavMenuSectionHeader"

// ** Utils
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent,
  canViewMenuGroup } from "@layouts/utils"

const VerticalMenuNavItems = (props) => {
  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader
  }

  // ** Render Nav Menu Items
  const RenderNavItems = props.items.map((item) => {
    const TagName = Components[resolveNavItemComponent(item)]
    if (item.children) {
      return (
        canViewMenuGroup(item) && <TagName item={item}  key={item.id || item.header} {...props} />
      )
    }
    return <TagName key={item.id || item.header} item={item} {...props} />
  })

  return RenderNavItems
}

export default VerticalMenuNavItems
