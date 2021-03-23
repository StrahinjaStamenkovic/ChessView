using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackEnd.Models
{
    [Table("GameInfo")]
    public class GameInfo
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("WhitePlayerID")]
        public int WhitePlayerID { get; set; }

        [Column("BlackPlayerID")]
        public int BlackPlayerID { get; set; }

        [Column("PGN")]
        [MaxLength(1000)]
        public string PGN { get; set; }

        [JsonIgnore]
        public virtual Archive GameArchive { get; set; }

    }
}