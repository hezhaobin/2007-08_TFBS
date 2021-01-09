##############################
#  perl load_enhancer.pl
#  Created Nov 29th 2007
#  To load the enhancer 
#  info into table "enhancer"
#  Hebin
#! /usr/bin/perl -w
##############################


use DBI;
prepareDbh();
$dbh->do(qq{truncate table enhancer});

die "Cannot open filename\n" unless open (f_Input, "filename");

$line = <f_Input>;
chomp $line;

while ($line ne '')
{
    ($region, $chr_arm, $start, $end) = (split(/\.|\-/, $line))[0,1,2,3];
    $dbh -> do(qq{insert into enhancer
                  values
                  ('$region', '$chr_arm', $start, $end)});
    $line = <f_Input>;
    chomp $line;
}

if (0){
    if ($line =~ /^(\S+)\s+(\S+)\s+(\S+)/)
    {    
	my $raw_tag_id = $1;
	my $seq = $2;
	my $aln_seq = $2;
	my $count = $3;
	
	if ($raw_tag_id =~ /DME-(\S+)/)
	{$mirna = $1;}
	else
	{
	    $seq =~ s/-//g;
	    $dbh->do(qq{insert into mel_mirna_tags
			    values
			    (null, '$mirna', '$raw_tag_id', '$seq', '$aln_seq', $count)});
	}
    }
}



sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
