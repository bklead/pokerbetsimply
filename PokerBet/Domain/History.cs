using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    [Table("History")]
    public class History
    {
        public int Id { get; set; }
        public int Round { get; set; }
        public string Winners { get; set; }
    }
}
