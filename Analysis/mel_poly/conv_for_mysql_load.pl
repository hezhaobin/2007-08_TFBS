##############################
# perl conv_for_mysql_load.pl
# Created Jul 30th 08
# to convert fasta into 
# a table format for mysql
# hebin
##############################

use Warnings;

open f_Input, "HBALL.fasta" ||
    die "Cannot open file\n";

@seqnames = qw(mel USAI USAII Can Per SpaI SpaII Eng CypI CypII RusI RusII Jap sec yak vir);
(%seq) = ();
$name = <f_Input>;
while(!eof(f_Input)){
    chomp $name;
    $name =~ tr/ //d;
    substr($name, 0, 1) = '';
    $line = <f_Input>;
    until($line =~ /\>/ || eof(f_Input)){
	chomp $line;
	$seq{$name} .= $line;
	$line = <f_Input>;
    }
    $seq{$name} = revseq($seq{$name});
    $name = $line;
}

$coordinate = 4517319;

print "Coordinate\tanc\tmel\tsec\tyak\tvir\tpoly\n";
$l = length((values(%seq))[0]);
for $i(0..$l){
    #solve ancestry;
    $anc = '';
    $mel = '';
    $poly = '';
    $alleles = 0;
    for $j(0..12){
	$mel = $mel.substr($seq{$seqnames[$j]}, $i, 1)." ";
    }
    chomp $mel;
    if(check($i)){#polymorphism;
	if($mel !~ /substr($seq{sec}, $i, 1)/){
	    $poly = 'wierd';
	}
	$anc = substr($seq{sec}, $i, 1);
	$poly = 'poly';
	$sec = substr($seq{sec}, $i, 1);
	$alleles = $mel =~ s/$sec/$sec/eg;
    }else{
	if(substr($mel, 0, 1) eq substr($seq{sec}, $i, 1)){#if mel = sec;
	    $anc = substr($mel, 0, 1);
	    $poly = 'mono';
	}elsif(substr($mel, 0,1) eq substr($seq{yak}, $i, 1)){#if mel = yak;
	    $anc = substr($mel, 0, 1);
	    $poly = 'mono';
	}elsif(substr($seq{sec}, $i, 1) eq substr($seq{yak}, $i, 1)){
	    $anc = substr($seq{sec}, $i, 1);
	    $poly = 'div';
	}elsif(substr($seq{sec}, $i, 1) ne substr($seq{yak}, $i, 1)){
	    $anc = '?';
	    $poly = 'div';
	}
    }
    if(1){
	print $coordinate, "\t";
	print "$anc\t$mel\t";
	for $j(13..15){
	    print substr($seq{$seqnames[$j]}, $i, 1), "\t";
	}
	print "$poly\t$alleles\n";
    }
    $coordinate ++ if(substr($seq{mel}, $i, 1) ne '-');
}

sub revseq
{
    my $seq = shift;
    $seq =~ tr/ACGT/TGCA/;
    return join('', reverse(split(//, $seq)));
}

sub check
{
    my $p = shift;
    my $flag = 0;
    my $ref = substr($seq{mel}, $p, 1);
    for my $i(1..12){
	if(substr($seq{$seqnames[$i]}, $p, 1) ne $ref){
	    $flag = 1;
	}
    }
    return $flag;
}
