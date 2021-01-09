##############################
#  perl annotation.pl
#! /usr/bin/perl -w
#  Created Sep 6th 2007
#  To predict the best match
#  to pwm in mel and annotate
#  the mysql tables
#  Hebin
##############################


use DBI;
prepareDbh();
open(f_File, "filename");
$filename = <f_File>;
chomp $filename;

open(f_Output, ">best_match_PWM.gff");#to store the predition information;
$flank = 5;

#initialize the database
$dbh -> do(qq(UPDATE tfbs_poly p, tfbs t
	      SET p.tf_name = 'bs'
	      WHERE p.coordinate between t.tfbs_start-$flank and t.tfbs_end+$flank));
$dbh -> do(qq(UPDATE tfbs_poly
	      SET tf_name = 'spacer'
	      WHERE tf_name is NULL));
$dbh -> do(qq(UPDATE tfbs_poly
	      SET tf_name = NULL
	      WHERE tf_name = 'bs'));

########################
# loop through regions #
########################
while(!eof(f_File)){
    die "Cannot open file $filename" unless open(f_Input, $filename);
    ($region, $chr_arm, $region_start, $region_end) = (split(/\.|\-/, $filename))[0,1,2,3];
    <f_Input>;
    $line = <f_Input>;
    chomp $line;
    $line =~ tr/\-//d;
    ####################
    # Retrieve all the 
    # binding sites
    # location
    ####################
    $sth = $dbh -> prepare(qq(select e.region as region, t.* 
			      from enhancer as e, tfbs as t 
			      where e.region = '$region' AND t.chr_arm = e.chr_arm AND t.tfbs_start between e.start and e.end order by t.tfbs_id));
    $sth -> execute();
    #@species = ('mel', 'c1674', 'md106', 'md199', 'newc', 'sim46', 'w501');
    (@array) = ();
    while(@array = $sth -> fetchrow_array()){
	#$patser_seq = '';
	#$align_seq = '';
	($region,$tfbs_id, $chr_arm, $factor, $target, $fp_start, $fp_end) = @array[0..6];
	#print $factor,"\n\t1   5    10   15   20 \n";
	if(($fp_start-$region_start) >= $flank){#get the footprinted sites with 5bp flanking;
	    $start = $fp_start-$flank;
	    $prefix = $flank;
	}else{
	    $start = $region_start;
	    $prefix = $fp_start - $region_start;
	}
	if(($region_end - $fp_end) >= $flank){
	    $end = $fp_end +$flank;
	    $suffix = $flank;
	}else{
	    $end = $region_end;
	    $suffix = $region_end - $fp_end;
	}
	$seq = lc(substr($line, $fp_start-$region_start-$prefix, $prefix)).
	                     substr($line, $fp_start-$region_start, $fp_end-$fp_start+1).
	                     lc(substr($line, $fp_end-$region_start+1, $suffix));
	if($seq =~ /N|n/){
	    next;
	}
	$patser_seq = 'mel'."\t\\".$seq."\\\n";
	#annotating the database;
	$result = `echo -n '$patser_seq' | 
                  ~/Documents/tfbs/patser/patser-v3b -A a:t 0.3 c:g 0.2 -m ~/Documents/tfbs/OptimalPatserMatrices/$factor -b 1 -d2 -c -t |
                  grep "width of the alignment matrix:\\|position="`;
	$result =~ /width of the alignment matrix:\s+(\d+)/;
	if($result eq ''){next;}
	$width = $1;
	($position,$score) = $result =~ /position=\s+(\d+C?)\s+score=\s+(\S+)\s+/;
	$sign = $position !~ /C/;
	if($sign){
	    $strand = "+";
	}else{
	    $position[$k] =~ tr/C//d;
	    $strand = "-";
	}
	$tfbs_start = $start + $position -1;
	$tfbs_end = $tfbs_start + $width -1;
	$dbh -> do(qq(UPDATE tfbs_poly 
		      SET tf_name = "bs"
		      WHERE coordinate between $tfbs_start and $tfbs_end AND region = '$region'));
	#check that I've done the right thing;
	$bs_seq = substr($seq, $position - 1, $width);
	$annotated_seq = substr($line, $start -$region_start + $position -1, $width);
	die "$bs_seq\n$annotated_seq\n$factor\t$region\t$tfbs_start\t$tfbs_end" unless (uc($bs_seq) eq uc($annotated_seq));
	#print the gff file;
	print f_Output "$chr_arm\thebin\t$factor\t$tfbs_start\t$tfbs_end\t$score\t$strand\t.\tFactor=$factor;Target=$target;FPID=$tfbs_id\n";
    }
    $sth -> finish();
    $filename = <f_File>;
    chomp $filename;
}

$dbh -> disconnect;

sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
sub align
{
    my $seq = shift;
    my (@seq) = split(//, $seq);
    my (@ref) = split(//, $seq{'mel'});
    my $length = length($seq);
    my $i = 0;
    for($i = 0; $i < $length; $i ++){
	if($seq[$i] eq $ref[$i]){
	    $seq[$i] = '.';
	}
    }
    return join("", @seq);
}
