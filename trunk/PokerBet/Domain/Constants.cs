using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    [Table("Constants")]
    public class Constants
    {
        [Key]
        public string Name { get; set; }
        public long Value { get; set; }
    }
}
