using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using System.Web.Mvc;

namespace PokerBet.Helpers
{
    public static class ExtensionMethods
    {
        public static List<SelectListItem> SelectItem(this List<SelectListItem> listItem, string selectItem )
        {
            listItem.ForEach(p => p.Selected = false);
            if (listItem.FirstOrDefault(p => p.Value == selectItem)!=null)
                listItem.FirstOrDefault(p => p.Value == selectItem).Selected = true;
                return listItem;
        }
    }
}